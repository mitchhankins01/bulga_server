import auth from '../config/auth';
import { UserController } from '../controllers/UserController';

export default class UserRoute {
  public userController: UserController = new UserController();

  public routes(app) {
    app.route('/login').post(auth.optional, this.userController.loginUser);

    app
      .route('/user')
      .get(auth.required, this.userController.getUserById)
      .post(auth.optional, this.userController.addUser);

    app
      .route('/user/:id')
      .get(auth.required, this.userController.getUserById)
      .patch(auth.required, this.userController.updateUser)
      .delete(auth.required, this.userController.deleteUser);
  }
}
