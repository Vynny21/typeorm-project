import { Router } from 'express'
import UserController from '../controller/UserController'

const router = Router()

// Get all users
router.get('/', UserController.listAll)

// Get one user
router.get(
  '/:id([0-9]+)',
  UserController.getOneById
)

// Create a new user
router.post('/', UserController.newUser)

// Edit one user
router.put(
  '/:id([0-9]+)',
  UserController.updateUser
)

// Delete one user
router.delete(
  '/:id([0-9]+)',
  UserController.deleteUser
)

export default router
