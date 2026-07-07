import { ApolloFastifyContextFunction } from '@as-integrations/fastify';
import type { FastifyRequest } from 'fastify';
import { verifyToken } from '@clerk/backend';

export interface GraphQLContext {
  userId: string | null;
}

export const buildContext: ApolloFastifyContextFunction<GraphQLContext> = async (
  request: FastifyRequest
) => {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    return { userId: null };
  }

  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { userId: null };
  }

  const token = authHeader.slice('Bearer '.length).trim();

  try {
    const payload = await verifyToken(token, {
      secretKey,
    });

    const userId = payload.sub;
    if (!userId) {
      return { userId: null };
    }

    return { userId };
  } catch {
    return { userId: null };
  }
};
