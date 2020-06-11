import { Router } from 'express'
import ProfileController from '../controller/ProfileController'

const router = Router()

router.get('/', ProfileController.listAll)
router.get('/:id', ProfileController.getOneById)
router.put('/:id', ProfileController.updateProfile)
router.delete('/:id', ProfileController.deleteProfile)

export default router