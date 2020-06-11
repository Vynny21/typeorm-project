// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { getRepository } from 'typeorm'
import { validate } from 'class-validator'

import { User } from '../entity/User'
import config from '../config/config'

/* O static serve para dizer que o atributo ou método pertence à classe,
e não ao objeto. Ou seja, você consegue acessar aquele atributo/método
externamente sem precisar instanciar o objeto.
Com o static, conseguimos acessar esses atributos e método sem precisar
dar um new, pois as propriedades estáticas pertencem a classe e
não ao objeto instanciado. */

class AuthController {
  static login = async (req: Request, res: Response) => {
    // Check if username and password are set
    const { username, password } = req.body

    if (!(username && password)) {
      return res.status(400).json({ error: 'Username and password not match.' })
    }

    // Get user from database
    const userRepository = getRepository(User)
    let user: User
    try {
      user = await userRepository.findOneOrFail({ where: { username } })
    } catch (error) {
      return res.status(401).json({ error: 'User not found.' })
    }

    // Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      return res.status(401).json({ error: 'Unencrypted password is not valid.' })
    }

    // Sing JWT, valid for 1 hour
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: '1h' }
    )

    // Send the jwt in the response
    res.send(token)
  }

  static changePassword = async (req: Request, res: Response) => {
    // Get ID from JWT
    const id = res.locals.jwtPayload.userId

    // Get parameters from the body
    const { email, newPassword } = req.body
    if (!(email && newPassword)) {
      return res.status(400).json({ error: 'The email and the new password for the password change were not sent.' })
    }

    // Get user from the database
    const userRepository = getRepository(User)
    let user: User
    try {
      user = await userRepository.findOneOrFail(id)
    } catch (id) {
      return res.status(401).json({ error: 'User not found.' })
    }

    // Validate de model (password lenght)
    user.password = newPassword
    const errors = await validate(user)
    if (errors.length > 0) {
      return res.status(400).send(errors)
    }

    // Hash the new password and save
    user.hashPassword()
    userRepository.save(user)

    res.status(204).send()
  };
}

export default AuthController
