declare namespace Cloudflare {
  interface Env {
    ADMIN_PASSWORD_HASH?: string;
    ADMIN_USERNAME?: string;
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}
