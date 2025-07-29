declare module "https://deno.land/std@0.168.0/http/server.ts" {
  export interface ConnInfo {
    readonly localAddr: Deno.Addr;
    readonly remoteAddr: Deno.Addr;
  }

  export type Handler = (request: Request, connInfo: ConnInfo) => Response | Promise<Response>;

  export interface ServerInit extends Partial<Deno.ListenOptions> {
    handler: Handler;
    onError?: (error: unknown) => Response | Promise<Response>;
  }

  export class Server {
    constructor(serverInit: ServerInit);
    serve(listener: Deno.Listener): Promise<void>;
    listenAndServe(): Promise<void>;
    close(): void;
    finished: Promise<void>;
  }

  export function serve(handler: Handler, options?: ServerInit): Promise<void>;
}

declare module "https://esm.sh/@supabase/supabase-js@2" {
  export function createClient(url: string, key: string, options?: any): any;
}