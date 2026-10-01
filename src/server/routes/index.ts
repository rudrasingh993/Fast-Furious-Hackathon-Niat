import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import conversationRoutes from './conversation.routes.js';
import messageRoutes from './message.routes.js';
import uploadRoutes from './upload.routes.js';
import aiRoutes from './ai.routes.js';
import searchRoutes from './search.routes.js';
import researchRoutes from './research.routes.js';
import knowledgeRoutes from './knowledge.routes.js';
import savedRoutes from './saved.routes.js';
import healthRoutes from './health.routes.js';

const apiRouter = Router();

apiRouter.use('/', healthRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/user', userRoutes);
apiRouter.use('/conversations', conversationRoutes);
apiRouter.use('/', messageRoutes);
apiRouter.use('/uploads', uploadRoutes);
apiRouter.use('/ai', aiRoutes);
apiRouter.use('/search', searchRoutes);
apiRouter.use('/research', researchRoutes);
apiRouter.use('/knowledge', knowledgeRoutes);
apiRouter.use('/', savedRoutes);

export default apiRouter;
