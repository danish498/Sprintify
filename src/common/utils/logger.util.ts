import { Logger } from '@nestjs/common';

export class CustomLogger extends Logger {
  error(message: string, trace?: string, context?: string) {
    // Add custom error logging logic here
    super.error(message, trace, context);
  }

  warn(message: string, context?: string) {
    // Add custom warning logging logic here
    super.warn(message, context);
  }

  log(message: string, context?: string) {
    // Add custom info logging logic here
    super.log(message, context);
  }

  debug(message: string, context?: string) {
    // Add custom debug logging logic here
    super.debug(message, context);
  }

  verbose(message: string, context?: string) {
    // Add custom verbose logging logic here
    super.verbose(message, context);
  }
}
