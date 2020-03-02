import express, {Router} from 'express';
import tasksRoutes from './tasks.routes';
import graphqlRoute from './graphql.route';

const router: Router = express.Router();

router.use('/api', tasksRoutes);
router.use('/graphql', graphqlRoute);

export default router;
