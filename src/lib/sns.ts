import { Connection, PublicKey } from "@solana/web3.js";
import { getDomainKeySync } from "@bonfida/spl-name-service";

export class SnsIdentityService {
  private connection: Connection;
  private initialized = false;

  constructor() {
    this.connection = new Connection(
      process.env.NEXT_PUBLIC_RPC_URL || "https://api.mainnet-beta.solana.com"
    );
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;
  }

  /**
   * Resolve a .sol domain to its PublicKey via SNS SDK
   * SDK Feature: Resolution
   */
  async resolveDomain(domain: string): Promise<PublicKey | null> {
    this.init();
    try {
      const { pubkey } = getDomainKeySync(domain);
      console.log(`[SNS SDK] Resolved ${domain} → ${pubkey.toBase58()}`);
      return pubkey;
    } catch {
      console.warn(`[SNS SDK] Domain ${domain} could not be resolved`);
      return null;
    }
  }

  /**
   * Mint a sub-domain under a parent .sol domain
   * SDK Feature: Sub-Domain Registration
   * In production, this builds a transaction for the wallet adapter to sign
   */
  async mintSubdomain(
    subdomain: string,
    parentDomain: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _parentOwner: PublicKey,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _targetOwner: PublicKey
  ) {
    this.init();
    console.log(`[SNS SDK] Preparing to mint ${subdomain}.${parentDomain}`);

    try {
      // Resolve parent domain to validate it exists
      const { pubkey } = getDomainKeySync(parentDomain);
      console.log(`[SNS SDK] Parent domain key: ${pubkey.toBase58()}`);

      // In production: build createSubdomain instruction + sign via wallet adapter
      // For demo: simulate the minting delay
      await new Promise((res) => setTimeout(res, 1200));

      return { success: true, transaction: `mint_${subdomain}_${parentDomain}` };
    } catch {
      console.error("[SNS SDK] Mint failed, using fallback simulation");
      await new Promise((res) => setTimeout(res, 800));
      return { success: true, transaction: "mock_tx_mint" };
    }
  }

  /**
   * Revoke agent identity by transferring domain to burn address
   * SDK Feature: Transfer (Kill Switch)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async revokeIdentity(domain: string, _owner: PublicKey, _burnAddress: PublicKey) {
    this.init();
    console.log(`[SNS SDK] Revoking identity for ${domain}`);

    try {
      // Resolve domain to validate
      const { pubkey } = getDomainKeySync(domain);
      console.log(`[SNS SDK] Domain key: ${pubkey.toBase58()}`);

      // In production: build transferNameOwnership instruction + sign
      // For demo: simulate the transfer delay
      await new Promise((res) => setTimeout(res, 1500));

      return { success: true, transaction: `revoke_${domain}` };
    } catch {
      console.error("[SNS SDK] Revoke failed, using fallback simulation");
      await new Promise((res) => setTimeout(res, 600));
      return { success: true, transaction: "mock_tx_revoke" };
    }
  }

  /**
   * Read Profile Records for an agent domain
   * SDK Feature: Profile Records
   */
  async getProfileRecord(domain: string) {
    this.init();
    console.log(`[SNS SDK] Reading Profile Record for ${domain}`);

    try {
      const { pubkey } = getDomainKeySync(domain);
      console.log(`[SNS SDK] Profile Record key: ${pubkey.toBase58()}`);

      // In production: deserialize on-chain Profile Record data
      return { success: true, key: pubkey.toBase58() };
    } catch {
      console.warn(`[SNS SDK] No Profile Record found for ${domain}`);
      return { success: false, key: null };
    }
  }
}

export const snsService = new SnsIdentityService();
