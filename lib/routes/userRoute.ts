import auth from '../config/auth';
import { UserController } from '../controllers/userController';

export default class UserRoute {
  public userController: UserController = new UserController();

  public routes(app) {
    app.route('/login').post(auth.optional, this.userController.loginUser);

    app
      .route('/user')
      .get(auth.required, this.userController.getUserById)
      .post(auth.optional, this.userController.addUser);

    // app
    //   .route('/user/:id')
    //   .get(auth.required, this.userController.getUserById)
    //   .patch(auth.required, this.userController.updateUser)
    //   .delete(auth.required, this.userController.deleteUser);

    app
      .route('/balance')
      .post(auth.required, this.userController.updateBalance);
  }
}
