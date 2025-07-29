// Deno type definitions for Supabase Edge Functions

declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
  }
  
  export const env: Env;
  
  export interface Addr {
    hostname: string;
    port: number;
    transport: "tcp" | "udp";
  }
  
  export interface Listener {
    addr: Addr;
    close(): void;
    [Symbol.asyncIterator](): AsyncIterableIterator<Conn>;
  }
  
  export interface Conn {
    localAddr: Addr;
    remoteAddr: Addr;
    rid: number;
    close(): void;
    read(p: Uint8Array): Promise<number | null>;
    write(p: Uint8Array): Promise<number>;
  }
  
  export interface HttpConn {
    rid: number;
    nextRequest(): Promise<RequestEvent | null>;
    close(): void;
  }
  
  export interface RequestEvent {
    request: Request;
    respondWith(r: Response | Promise<Response>): Promise<void>;
  }
  
  export interface ListenOptions {
    port: number;
    hostname?: string;
    transport?: "tcp";
  }
  
  export function listen(options: ListenOptions): Listener;
  export function serveHttp(conn: Conn): HttpConn;
  
  export namespace errors {
    export class Http extends Error {
      constructor(message: string);
    }
  }
}

// Global types for Deno runtime
declare const Deno: typeof Deno;
