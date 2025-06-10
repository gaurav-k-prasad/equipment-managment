import { GraphQLSchema } from "graphql";
import { ApolloServerPlugin } from "@apollo/server";
import { Context } from "./context";

export const loggingPlugin: ApolloServerPlugin = {
  async requestDidStart() {
    const startTime = Date.now();

    return {
      async parsingDidStart() {
        return async (err) => {
          if (err) {
            console.error("GraphQL parsing error:", err);
          }
        };
      },

      async validationDidStart() {
        return async (errs) => {
          if (errs && errs.length > 0) {
            console.error("GraphQL validation errors:", errs);
          }
        };
      },

      async executionDidStart() {
        return {
          willResolveField({
            source,
            args,
            contextValue,
            info,
          }: {
            source: any;
            args: any;
            contextValue: Context;
            info: any;
          }) {
            const startTime = Date.now();

            return (error, result) => {
              const duration = Date.now() - startTime;
              const operation = info.operation.operation;
              const fieldName = info.fieldName;

              console.log({
                operation,
                fieldName,
                duration,
                error: error ? error.message : null,
                args,
                userId: contextValue.user?.id,
              });
            };
          },
        };
      },

      async willSendResponse(requestContext) {
        const duration = Date.now() - startTime;
        const { operationName, variables } = requestContext.request;

        console.log({
          operationName,
          variables,
          duration,
          errors: requestContext.errors,
        });
      },
    };
  },
};

export const errorHandlingPlugin: ApolloServerPlugin = {
  async requestDidStart() {
    return {
      async didEncounterErrors(requestContext) {
        const { errors, request } = requestContext;

        errors.forEach((error) => {
          console.error({
            message: error.message,
            path: error.path,
            extensions: error.extensions,
            operation: request.operationName,
            variables: request.variables,
          });
        });
      },
    };
  },
};

export const plugins = [loggingPlugin, errorHandlingPlugin];
