import type { FastifyReply, FastifyRequest } from 'fastify';
import { verifyToken } from '@clerk/backend';

export async function requireUser(request: FastifyRequest, reply: FastifyReply) {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    reply.code(500).send({ message: 'Missing CLERK_SECRET_KEY in API environment' });
    return null;
  }

  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    reply.code(401).send({ message: 'Missing bearer token' });
    return null;
  }

  const token = authHeader.slice('Bearer '.length).trim();

  try {
    const payload = await verifyToken(token, {
      secretKey,
    });

    const userId = payload.sub;
    if (!userId) {
      reply.code(401).send({ message: 'Invalid token payload' });
      return null;
    }

    return userId;
  } catch {
    reply.code(401).send({ message: 'Invalid or expired token' });
    return null;
  }
}
