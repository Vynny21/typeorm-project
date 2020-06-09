import { Router } from 'express'
import UserController from '../controller/UserController'
import { checkJwt } from "../middlewares/checkJwt"
import { checkRole } from '../middlewares/checkRole'

const router = Router();

//Get all users
router.get('/user', [checkJwt, checkRole(['ADMIN'])], UserController.listAll)

// Get one user
router.get(
  '/user/:id([0-9]+)',
  [checkJwt, checkRole(['ADMIN'])],
  UserController.getOneById
);

//Create a new user
router.post('/user', [checkJwt, checkRole(['ADMIN'])], UserController.newUser)

//Edit one user
router.patch(
  '/user/:id([0-9]+)',
  [checkJwt, checkRole(['ADMIN'])],
  UserController.updateUser
)

//Delete one user
router.delete(
  '/user/:id([0-9]+)',
  [checkJwt, checkRole(['ADMIN'])],
  UserController.deleteUser
)

export default router