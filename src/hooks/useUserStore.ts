import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Asset {
  symbol: string;
  name: string;
  balance: number;
  price: number;
  icon: string;
}

export interface VaultPosition {
  vaultId: string;
  vaultName: string;
  asset: string;
  amount: number;
  apy: number;
  risk: string;
  value: number;
}

interface UserState {
  assets: Asset[];
  vaultPositions: VaultPosition[];
  totalBalance: number;
  
  // Actions
  updateAssetBalance: (symbol: string, amount: number) => void;
  depositToVault: (vaultId: string, vaultName: string, asset: string, amount: number, apy: number, risk: string) => void;
  withdrawFromVault: (vaultId: string, amount: number) => void;
  swapAssets: (fromSymbol: string, toSymbol: string, fromAmount: number, toAmount: number) => void;
  calculateTotalBalance: () => void;
}

const initialAssets: Asset[] = [
  { 
    symbol: "USDC", 
    name: "USD Coin", 
    balance: 0,
    price: 1.00,
    icon: "💵"
  },
  { 
    symbol: "ETH", 
    name: "Ethereum", 
    balance: 0,
    price: 2432.18,
    icon: "⚡"
  },
  { 
    symbol: "WBTC", 
    name: "Wrapped Bitcoin", 
    balance: 0,
    price: 43521.90,
    icon: "₿"
  },
  { 
    symbol: "DAI", 
    name: "DAI Stablecoin", 
    balance: 0,
    price: 0.9998,
    icon: "🏛️"
  }
];

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      assets: initialAssets,
      vaultPositions: [],
      totalBalance: 0,

      updateAssetBalance: (symbol: string, amount: number) => {
        set((state) => {
          const newAssets = state.assets.map(asset => 
            asset.symbol === symbol 
              ? { ...asset, balance: asset.balance + amount }
              : asset
          );
          const newState = { ...state, assets: newAssets };
          // Calculate total balance
          const totalBalance = newAssets.reduce((total, asset) => 
            total + (asset.balance * asset.price), 0
          ) + state.vaultPositions.reduce((total, position) => total + position.value, 0);
          
          return { ...newState, totalBalance };
        });
      },

      depositToVault: (vaultId: string, vaultName: string, asset: string, amount: number, apy: number, risk: string) => {
        set((state) => {
          // Find asset price
          const assetData = state.assets.find(a => a.symbol === asset);
          const value = assetData ? amount * assetData.price : amount;
          
          // Check if position already exists
          const existingPositionIndex = state.vaultPositions.findIndex(p => p.vaultId === vaultId);
          
          let newVaultPositions;
          if (existingPositionIndex >= 0) {
            // Update existing position
            newVaultPositions = state.vaultPositions.map((position, index) => 
              index === existingPositionIndex 
                ? { ...position, amount: position.amount + amount, value: position.value + value }
                : position
            );
          } else {
            // Create new position
            newVaultPositions = [...state.vaultPositions, {
              vaultId,
              vaultName,
              asset,
              amount,
              apy,
              risk,
              value
            }];
          }

          // Deduct from asset balance
          const newAssets = state.assets.map(a => 
            a.symbol === asset 
              ? { ...a, balance: a.balance - amount }
              : a
          );

          // Calculate total balance
          const totalBalance = newAssets.reduce((total, a) => 
            total + (a.balance * a.price), 0
          ) + newVaultPositions.reduce((total, position) => total + position.value, 0);

          return {
            ...state,
            assets: newAssets,
            vaultPositions: newVaultPositions,
            totalBalance
          };
        });
      },

      withdrawFromVault: (vaultId: string, amount: number) => {
        set((state) => {
          const position = state.vaultPositions.find(p => p.vaultId === vaultId);
          if (!position) return state;

          // Update vault position
          const newVaultPositions = state.vaultPositions.map(p => 
            p.vaultId === vaultId 
              ? { ...p, amount: p.amount - amount, value: p.value - (amount * (position.value / position.amount)) }
              : p
          ).filter(p => p.amount > 0);

          // Add back to asset balance
          const newAssets = state.assets.map(asset => 
            asset.symbol === position.asset 
              ? { ...asset, balance: asset.balance + amount }
              : asset
          );

          // Calculate total balance
          const totalBalance = newAssets.reduce((total, asset) => 
            total + (asset.balance * asset.price), 0
          ) + newVaultPositions.reduce((total, pos) => total + pos.value, 0);

          return {
            ...state,
            assets: newAssets,
            vaultPositions: newVaultPositions,
            totalBalance
          };
        });
      },

      swapAssets: (fromSymbol: string, toSymbol: string, fromAmount: number, toAmount: number) => {
        set((state) => {
          const newAssets = state.assets.map(asset => {
            if (asset.symbol === fromSymbol) {
              return { ...asset, balance: asset.balance - fromAmount };
            }
            if (asset.symbol === toSymbol) {
              return { ...asset, balance: asset.balance + toAmount };
            }
            return asset;
          });

          // Calculate total balance
          const totalBalance = newAssets.reduce((total, asset) => 
            total + (asset.balance * asset.price), 0
          ) + state.vaultPositions.reduce((total, position) => total + position.value, 0);

          return { ...state, assets: newAssets, totalBalance };
        });
      },

      calculateTotalBalance: () => {
        set((state) => {
          const totalBalance = state.assets.reduce((total, asset) => 
            total + (asset.balance * asset.price), 0
          ) + state.vaultPositions.reduce((total, position) => total + position.value, 0);
          
          return { ...state, totalBalance };
        });
      }
    }),
    {
      name: 'user-store'
    }
  )
);