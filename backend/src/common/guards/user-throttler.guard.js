import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {

  getTracker(req) {
    // If user is authenticated (JWT)
    if (req.user && req.user._id) {
      return `user:${req.user._id.toString()}`;
    }

    // Fallback for unauthenticated requests
    return req.ip;
  }

  generateKey(context, tracker, throttlerName) {
    return `throttle:${throttlerName}:${tracker}`;
  }
}
