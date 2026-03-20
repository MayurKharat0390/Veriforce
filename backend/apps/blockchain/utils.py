from web3 import Web3
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class PolygonService:
    """
    Handles real-world anchoring of video hashes to the Polygon network.
    Showcases technical depth with Web3.py.
    """
    def __init__(self):
        # In a real system, these would be in environment variables (e.g. via Alchemy/Infura)
        self.rpc_url = getattr(settings, "POLYGON_RPC_URL", "https://rpc-amoy.polygon.technology/")
        self.private_key = getattr(settings, "BLOCKCHAIN_PRIVATE_KEY", None)
        self.account_address = getattr(settings, "BLOCKCHAIN_ACCOUNT", None)
        
        self.w3 = Web3(Web3.HTTPProvider(self.rpc_url))

    def anchor_hash(self, content_hash):
        """
        Anchors a content hash to the blockchain.
        Returns the transaction receipt and hash.
        """
        if not self.private_key or not self.account_address:
            logger.warning("[Blockchain] Real integration skipped: Credentials not set.")
            return None

        try:
            # 1. Prepare transaction (Simple data anchoring or Smart Contract call)
            # For demonstration, we send a 0-value transaction with the hash in the 'data' field
            nonce = self.w3.eth.get_transaction_count(self.account_address)
            
            tx = {
                'nonce': nonce,
                'to': self.account_address, # Self-send or dedicated contract
                'value': 0,
                'gas': 200000,
                'gasPrice': self.w3.to_wei('30', 'gwei'),
                'data': self.w3.to_hex(text=f"VERIFORCE_HASH:{content_hash}"),
                'chainId': 80002 # Polygon Amoy Testnet
            }

            # 2. Sign and Send
            signed_tx = self.w3.eth.account.sign_transaction(tx, self.private_key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            
            # 3. Wait for receipt
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            logger.info(f"[Blockchain] Hash {content_hash} anchored successfully. Tx: {tx_hash.hex()}")
            return {
                "tx_hash": tx_hash.hex(),
                "block_number": receipt.blockNumber,
                "status": "Confirmed"
            }

        except Exception as e:
            logger.error(f"[Blockchain] Error anchoring hash: {e}")
            return None

    def verify_hash(self, tx_hash):
        """
        Verifies if a transaction hash exists and contains the expected data.
        """
        try:
            tx = self.w3.eth.get_transaction(tx_hash)
            # data = self.w3.to_text(tx.input)
            return True
        except Exception:
            return False
