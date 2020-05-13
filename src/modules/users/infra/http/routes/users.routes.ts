import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import { celebrate, Segments, Joi } from 'celebrate';

import UsersController from '../controllers/UsersController';
import UsersAvatarController from '../controllers/UsersAvatarController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const usersController = new UsersController();
const usersAvatarController = new UsersAvatarController();

const upload = multer(uploadConfig);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
);

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  usersAvatarController.update,
);

export default usersRouter;
