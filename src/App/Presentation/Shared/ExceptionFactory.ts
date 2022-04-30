import ErrorHttpException from './ErrorHttpException';
import TokenExpiredHttpException from '../../../Auth/Presentation/Exceptions/TokenExpiredHttpException';
import DuplicateEntityHttpException from '../Exceptions/DuplicateEntityHttpException';
import exceptions from '../../../exceptions';
import { StatusCode } from '@digichanges/shared-experience';

class ExceptionFactory
{
    private exceptionsMapper = {
        ...exceptions,
        Error: StatusCode.HTTP_INTERNAL_SERVER_ERROR,
        TypeError: StatusCode.HTTP_INTERNAL_SERVER_ERROR,
        [ErrorHttpException.name]: StatusCode.HTTP_INTERNAL_SERVER_ERROR
    };

    public getException(err: any): ErrorHttpException
    {
        const statusCode = this.exceptionsMapper[err?.name] ?? StatusCode.HTTP_INTERNAL_SERVER_ERROR;

        let exception = new ErrorHttpException();

        exception.message = err?.message;
        exception.errorCode = err?.errorCode;
        exception.metadata = err?.metadata ?? {};
        exception.statusCode = err?.statusCode ?? statusCode;
        exception.errors = err?.errors ?? [];

        if (err instanceof Error && err.message === 'Token expired')
        {
            exception = new TokenExpiredHttpException();
        }
        else if (err?.name === 'MongoServerError' || err?.name === 'QueryFailedError')
        {
            if (err.code === 11000 || err.code === '23505')
            {
                exception = new DuplicateEntityHttpException();
            }
        }
        else if (err?.name === 'UniqueConstraintViolationException')
        {
            exception = new DuplicateEntityHttpException();
        }

        return exception;
    }
}

export default ExceptionFactory;
