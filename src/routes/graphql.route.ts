import express from 'express';
import GraphqlController from '../controllers/GraphqlController';

const router = express.Router();
const graphqlController = new GraphqlController();

router.route('/')
  .post(graphqlController.exec.bind(graphqlController))
  .get(graphqlController.ide.bind(graphqlController));

export default router;
