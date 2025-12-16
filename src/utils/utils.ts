import { toast } from 'sonner';

export const handleCopyAddress = (address: string) => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('Contract address copied to clipboard');
    }
  };