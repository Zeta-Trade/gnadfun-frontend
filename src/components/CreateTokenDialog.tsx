import { useState, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Wallet, AlertCircle, Upload, Send, Globe, ChevronDown } from "lucide-react";
import { useGlobalContext } from "../context/GlobalContext";
import { toast } from "sonner";
import { useTranslation } from "../hooks/useTranslation";
import type { Token } from "../types/token";
import { uploadJsonToWeb3Storage, uploadFileToWeb3Storage } from '@/utils/ipfs';

type CreateTokenPayload = Pick<
  Token,
  "name" | "symbol" | "description" | "imageUrl" | "creator" | "price" | "priceChange24h" | "twitter" | "telegram" | "website"
>;

interface CreateTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateToken: (token: CreateTokenPayload) => void;
}

export function CreateTokenDialog({
  open,
  onOpenChange,
  onCreateToken,
}: CreateTokenDialogProps) {
  const { account, formatAccount, connectWallet } = useGlobalContext();
  const t = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    imageUrl: '',
    twitter: '',
    telegram: '',
    website: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    symbol: '',
  });
  const [creatorBuyEnabled, setCreatorBuyEnabled] = useState(false);
  const [socialsExpanded, setSocialsExpanded] = useState(false);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      symbol: '',
      description: '',
      imageUrl: '',
      twitter: '',
      telegram: '',
      website: '',
    });
    setErrors({ name: '', symbol: '' });
  }, []);

  const handleImageFileProcess = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      // keep preview data URL and store file for IPFS upload
      setFormData(prev => ({ ...prev, imageUrl: e.target?.result as string }));
      setImageFile(file);
      toast.success('Image uploaded');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageFileProcess(file);
    }
  }, [handleImageFileProcess]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      handleImageFileProcess(file);
    }
  }, [handleImageFileProcess]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = { name: '', symbol: '' };
    
    if (!formData.name) {
      newErrors.name = 'Token Name is required';
    }
    if (!formData.symbol) {
      newErrors.symbol = 'Token Symbol is required';
    }
    
    setErrors(newErrors);
    
    if (!account) {
      toast.error('Please connect your wallet first!');
      return;
    }

    if (!formData.name || !formData.symbol || !formData.description) {
      toast.error('Please fill in all required fields!');
      return;
    }

    (async () => {
      const tokenBase: CreateTokenPayload = {
        ...formData,
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&h=200&fit=crop',
        creator: formatAccount(account),
        price: 0.00001,
        priceChange24h: 0,
      };

      // Upload image file first if available
      let imageCid: string | undefined;
      if (imageFile) {
        try {
          toast.loading('Uploading image to IPFS...');
          const r = await uploadFileToWeb3Storage(imageFile);
          if (r?.cid) {
            imageCid = r.cid;
            tokenBase.imageUrl = `https://ipfs.io/ipfs/${imageCid}`;
            toast.success('Image uploaded to IPFS');
          } else {
            toast.error('Image upload to IPFS failed or not configured');
          }
        } catch (err) {
          console.error(err);
          toast.error('Image upload failed — proceeding without IPFS');
        }
      }

      // Prepare metadata and upload
      const metadata = {
        name: tokenBase.name,
        symbol: tokenBase.symbol,
        description: tokenBase.description,
        image: imageCid ? `ipfs://${imageCid}` : tokenBase.imageUrl,
        creator: tokenBase.creator,
        twitter: tokenBase.twitter,
        telegram: tokenBase.telegram,
        website: tokenBase.website,
        createdAt: new Date().toISOString(),
      };

      let cid: string | undefined;
      try {
        toast.loading('Uploading metadata to IPFS...');
        const res = await uploadJsonToWeb3Storage(metadata);
        if (res?.cid) {
          cid = res.cid;
          toast.success('Metadata uploaded to IPFS');
        }
      } catch (err) {
        console.error(err);
        toast.error('Metadata upload failed — proceeding without IPFS');
      }

      const outToken = {
        ...tokenBase,
        ...(cid ? { ipfsCid: cid, metadataUrl: `https://ipfs.io/ipfs/${cid}` } : {}),
      };

      onCreateToken(outToken);
      resetForm();
      onOpenChange(false);
      toast.success('Token launched successfully!');
    })();
  }, [account, formatAccount, formData, onCreateToken, resetForm, onOpenChange]);

  const handleConnectWallet = useCallback(() => {
    void connectWallet();
  }, [connectWallet]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 border border-purple-500/30 text-white max-w-2xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 pointer-events-none rounded-lg" />
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 drop-shadow-lg">
            {t.launchToken.launchYourToken}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {t.common.noCodeRequired}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {/* Wallet Connection */}
          {!account ? (
            <>
              <Alert className="bg-purple-500/10 border-purple-500/30">
                <AlertCircle className="size-4 text-purple-400" />
                <AlertDescription className="text-white/70">
                  {t.launchToken.connectWalletToLaunch}
                </AlertDescription>
              </Alert>
              <Button
                type="button"
                onClick={handleConnectWallet}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Wallet className="size-4 mr-2" />
                {t.header.connectWallet}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <Label className="text-white font-semibold mb-2 block">{t.launchToken.uploadImage}</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                      dragActive
                        ? 'border-gray-300 bg-gray-500/10'
                        : 'border-gray-600 bg-gray-900/50 hover:border-gray-500'
                    }`}
                  >
                    {formData.imageUrl ? (
                      <div className="space-y-2">
                        <img
                          src={formData.imageUrl}
                          alt="preview"
                          className="w-24 h-24 rounded-lg mx-auto object-cover"
                        />
                        <p className="text-sm text-white/70">{t.launchToken.clickOrDrag}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="size-8 mx-auto text-gray-400" />
                        <p className="text-white/70">{t.launchToken.dragDropFull}</p>
                        <p className="text-xs text-white/50">{t.common.jpegPng}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="name" className="text-white font-semibold">{t.launchToken.tokenName}</Label>
                  <Input
                    id="name"
                    placeholder={t.common.enterTokenName}
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (e.target.value) {
                        setErrors({ ...errors, name: '' });
                      }
                    }}
                    className={`bg-gray-800/50 border text-white placeholder:text-white/40 ${
                      errors.name ? 'border-red-500' : 'border-gray-700'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="symbol" className="text-white font-semibold">{t.launchToken.tokenSymbol}</Label>
                  <Input
                    id="symbol"
                    placeholder={t.common.enterToken}
                    value={formData.symbol}
                    onChange={(e) => {
                      setFormData({ ...formData, symbol: e.target.value.toUpperCase() });
                      if (e.target.value) {
                        setErrors({ ...errors, symbol: '' });
                      }
                    }}
                    className={`bg-gray-800/50 border text-white placeholder:text-white/40 ${
                      errors.symbol ? 'border-red-500' : 'border-gray-700'
                    }`}
                    maxLength={10}
                  />
                  {errors.symbol && (
                    <p className="text-xs text-red-500">{errors.symbol}</p>
                  )}
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <Label className="text-white font-semibold block">{t.launchToken.creatorBuy}</Label>
                    <p className="text-xs text-white/60 mt-1">{t.launchToken.creatorBuyDesc}</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={creatorBuyEnabled}
                      onChange={(e) => setCreatorBuyEnabled(e.target.checked)}
                      className="w-5 h-5 rounded cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSocialsExpanded(!socialsExpanded)}
                  className="w-full bg-lime-400 text-black font-semibold py-3 rounded-lg flex items-center justify-between px-4 hover:bg-lime-500 transition-colors"
                >
                  <span>{t.launchToken.socials}</span>
                  <ChevronDown className={`size-4 transition-transform ${socialsExpanded ? 'rotate-180' : ''}`} />
                </button>

                {socialsExpanded && (
                  <div className="space-y-3 bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-white/60 flex items-center gap-1">
                        X
                      </Label>
                      <Input
                        placeholder={t.launchToken.exampleUsername}
                        value={formData.twitter}
                        onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                        className="bg-gray-700/50 border border-gray-600 text-white placeholder:text-white/30 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-white/60 flex items-center gap-1">
                        <Send className="size-3" /> {t.launchToken.telegram}
                      </Label>
                      <Input
                        placeholder={t.launchToken.exampleUsername}
                        value={formData.telegram}
                        onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                        className="bg-gray-700/50 border border-gray-600 text-white placeholder:text-white/30 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-white/60 flex items-center gap-1">
                        <Globe className="size-3" /> {t.launchToken.website}
                      </Label>
                      <Input
                        placeholder={t.launchToken.exampleDomain}
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="bg-gray-700/50 border border-gray-600 text-white placeholder:text-white/30 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-lime-400 text-black font-semibold py-3 rounded-lg hover:bg-lime-500 transition-colors"
              >
                {t.launchToken.deploy}
              </Button>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}