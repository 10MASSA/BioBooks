import jwt from 'jsonwebtoken'

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const token = header.split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET || 'secret')
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export function verifyToken(token) {
  try {
    jwt.verify(token, process.env.JWT_SECRET || 'secret')
    return true
  } catch {
    return false
  }
}
