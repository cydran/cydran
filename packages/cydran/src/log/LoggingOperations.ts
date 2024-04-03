import ConditionalLoggingOperations from 'log/ConditionalLoggingOperations';
import QueryLoggingOperations from 'log/QueryLoggingOperations';
import ImperativeLoggingOperations from 'log/ImperativeLoggingOperations';

interface LoggingOperations extends ConditionalLoggingOperations, QueryLoggingOperations, ImperativeLoggingOperations {

	// Intentionally empty

}

export default LoggingOperations;
