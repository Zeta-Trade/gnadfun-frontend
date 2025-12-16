'use client';

import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Rocket, Wallet, AlertCircle, Upload, ChevronDown, ChevronUp } from "lucide-react";
import { useGlobalContext } from "../context/GlobalContext";
import { useTokenStore } from "../store/tokenStore";
import Header from "../components/Header";
import { toast } from "sonner";
import { uploadJsonToWeb3Storage, uploadFileToWeb3Storage } from '@/utils/ipfs';
import { useTranslation } from "../hooks/useTranslation";
import type { Token } from "../types/token";

type CreateTokenPayload = Pick<
  Token,
  "name" | "symbol" | "description" | "imageUrl" | "creator" | "price" | "priceChange24h" | "twitter" | "telegram" | "website"
>;

export default function LaunchTokenPage() {
  const navigate = useNavigate();
  const { account, formatAccount, connectWallet } = useGlobalContext();
  const { addToken } = useTokenStore();
  const t = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSocials, setShowSocials] = useState(false);
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

  const handleImageFileProcess = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      // keep preview as data URL but store File for IPFS upload
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

  const handleConnectWallet = useCallback(() => {
    void connectWallet();
  }, [connectWallet]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) {
      toast.error('Please connect your wallet first!');
      return;
    }

    if (!formData.name || !formData.symbol || !formData.description) {
      toast.error('Please fill in all required fields!');
      return;
    }

    const token: CreateTokenPayload = {
      ...formData,
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&h=200&fit=crop',
      creator: formatAccount(account),
      price: 0.00001,
      priceChange24h: 0,
    };

    // upload image file separately to IPFS (if present) then upload metadata that references image CID
    let imageCid: string | undefined;
    if (imageFile) {
      toast.loading('Uploading image to IPFS...');
      try {
        const r = await uploadFileToWeb3Storage(imageFile);
        if (r?.cid) {
          imageCid = r.cid;
          // set imageUrl to gateway link
          const gatewayUrl = `https://ipfs.io/ipfs/${imageCid}`;
          setFormData((prev) => ({ ...prev, imageUrl: gatewayUrl }));
          toast.success('Image uploaded to IPFS');
        } else {
          toast.error('Image upload to IPFS failed or not configured');
        }
      } catch (err) {
        console.error(err);
        toast.error('Image upload failed — proceeding without IPFS');
      }
    }

    // prepare metadata for IPFS (reference the image CID if available)
    const metadata = {
      name: token.name,
      symbol: token.symbol,
      description: token.description,
      image: imageCid ? `ipfs://${imageCid}` : token.imageUrl,
      creator: token.creator,
      twitter: token.twitter,
      telegram: token.telegram,
      website: token.website,
      createdAt: new Date().toISOString(),
    };

    toast.loading('Uploading metadata to IPFS...');
    let cid: string | undefined;
    try {
      const result = await uploadJsonToWeb3Storage(metadata);
      if (result && result.cid) {
        cid = result.cid;
        toast.success('Metadata uploaded to IPFS');
      } else {
        toast.error('IPFS metadata upload not configured or failed — proceeding without IPFS');
      }
    } catch (err) {
      console.error(err);
      toast.error('IPFS metadata upload failed — proceeding without IPFS');
    }

    const newToken: Token = {
      ...token,
      id: Date.now().toString(),
      createdAt: new Date(),
      marketCap: 0,
      volume24h: 0,
      holders: 1,
      chartData: [
        { time: '00:00', price: token.price },
        { time: '04:00', price: token.price },
        { time: '08:00', price: token.price },
        { time: '12:00', price: token.price },
        { time: '16:00', price: token.price },
      ],
      ...(cid ? { ipfsCid: cid, metadataUrl: `https://ipfs.io/ipfs/${cid}` } : {}),
    };

    addToken(newToken);
    toast.success('Token launched successfully!');
    setTimeout(() => navigate('/'), 1000);
  }, [account, formatAccount, formData, addToken, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <Header sticky />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 pointer-events-none rounded-2xl" />

          <div className="relative z-10 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-2xl p-8 shadow-2xl">
            {/* Title */}
            <div className="mb-8 text-center animate-in fade-in-0 slide-in-from-top-4 duration-500">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 drop-shadow-lg mb-2">
                {t.launchToken.launchYourToken}
              </h1>
              <p className="text-lg text-white/70 animate-in fade-in-0 slide-in-from-top-2 duration-500" style={{fontWeight: "bold"}}>
                {t.launchToken.createNewToken}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Wallet Connection */}
              {!account ? (
                <>
                  <Alert className="bg-purple-500/10 border-purple-500/30 animate-in fade-in-0 slide-in-from-top-2 duration-500">
                    <AlertCircle className="size-4 text-purple-400" />
                    <AlertDescription className="text-white/70">
                      {t.launchToken.connectWalletToLaunch}
                    </AlertDescription>
                  </Alert>
                  <Button
                    type="button"
                    onClick={handleConnectWallet}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-semibold py-2 transition-all duration-200  hover:shadow-lg"
                  >
                    <Wallet className="size-4 mr-2" />
                    {t.header.connectWallet}
                  </Button>
                </>
              ) : (
                <>

                  {/* Token Image */}
                  <div className="space-y-2 animate-in fade-in-0 slide-in-from-bottom-3 duration-500" style={{ animationDelay: '250ms' }}>
                    <Label className="text-white font-semibold">{t.launchToken.uploadImage}</Label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                      style={{ display: 'none' }}
                    />
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${dragActive
                        ? 'border-pink-400 bg-pink-500/10 scale-105'
                        : 'border-purple-400/50 bg-purple-500/5 hover:border-purple-400 hover:bg-purple-500/10 hover:scale-102'
                        }`}
                    >
                      {formData.imageUrl ? (
                        <div className="space-y-2 animate-in fade-in-0 zoom-in-95 duration-200">
                          <img
                            src={formData.imageUrl}
                            alt="preview"
                            className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-purple-400/50 transition-transform duration-200 hover:scale-110"
                          />
                          <p className="text-sm text-white/70">{t.launchToken.clickOrDrag}</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="size-8 mx-auto text-purple-400 transition-transform duration-200 hover:scale-110" />
                          <p className="text-white/70">{t.launchToken.dragDrop}</p>
                          <p className="text-xs text-white/50">{t.launchToken.orClickToBrowse}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Token Name */}
                  <div className="space-y-2 animate-in fade-in-0 slide-in-from-bottom-3 duration-500" style={{ animationDelay: '100ms' }}>
                    <Label htmlFor="name" className="text-white font-semibold">{t.launchToken.tokenName} *</Label>
                    <Input
                      id="name"
                      placeholder={t.launchToken.example}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 transition-all duration-200 hover:bg-white/10 hover:border-purple-400/50 focus:bg-white/10 focus:border-purple-400"
                      required
                    />
                  </div>

                  {/* Token Symbol */}
                  <div className="space-y-2 animate-in fade-in-0 slide-in-from-bottom-3 duration-500" style={{ animationDelay: '150ms' }}>
                    <Label htmlFor="symbol" className="text-white font-semibold">{t.launchToken.tokenSymbol} *</Label>
                    <Input
                      id="symbol"
                      placeholder={t.launchToken.exampleSymbol}
                      value={formData.symbol}
                      onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 transition-all duration-200 hover:bg-white/10 hover:border-purple-400/50 focus:bg-white/10 focus:border-purple-400"
                      maxLength={10}
                      required
                    />
                    <p className="text-xs text-white/50">{t.launchToken.maxCharacters}</p>
                  </div>

                  {/* Description */}
                  <div className="space-y-2 animate-in fade-in-0 slide-in-from-bottom-3 duration-500" style={{ animationDelay: '200ms' }}>
                    <Label htmlFor="description" className="text-white font-semibold">{t.launchToken.description} *</Label>
                    <Textarea
                      id="description"
                      placeholder={t.launchToken.launchYourTokenDesc}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-24 transition-all duration-200 hover:bg-white/10 hover:border-purple-400/50 focus:bg-white/10 focus:border-purple-400"
                      required
                    />
                  </div>

                  {/* Add Socials Button */}
                  <div className="animate-in fade-in-0 slide-in-from-bottom-3 duration-500" style={{ animationDelay: '300ms' }}>
                    <button
                      type="button"
                      onClick={() => setShowSocials(!showSocials)}
                      className="w-full flex items-center justify-between bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border border-purple-500/30 hover:border-purple-400/50 rounded-lg px-4 py-2 text-white font-bold transition-all duration-200 "
                    >
                      <span className="flex items-center gap-1">
                        <span className="text-medium">🔗</span> {t.launchToken.addSocialLinks}
                      </span>
                      {showSocials ? (
                        <ChevronUp className="size-5" />
                      ) : (
                        <ChevronDown className="size-5" />
                      )}
                    </button>
                  </div>

                  {/* Social Links Section */}
                  {showSocials && (
                    <div className="space-y-3 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-xl p-4 border border-purple-500/20 animate-in fade-in-0 slide-in-from-top-2 duration-300 transition-all hover:border-purple-400/40 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10">
                      <div className="grid grid-cols-3 gap-3">
                        {/* X / Twitter */}
                        <div className="space-y-1 transition-all duration-200 text-white ">
                          <Label className="text-xs text-white/70 flex items-center gap-1 transition-colors duration-200">
                            {t.launchToken.twitter}
                          </Label>
                          <Input
                            placeholder={t.launchToken.exampleUsername}
                            value={formData.twitter}
                            onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 text-sm h-8 transition-all duration-200 hover:bg-white/10 hover:border-blue-400/50 focus:bg-white/10 focus:border-blue-400"
                          />
                        </div>

                        {/* Telegram */}
                        <div className="space-y-1 transition-all duration-200 ">
                          <Label className="text-xs text-white/70 flex items-center gap-1 transition-colors duration-200">
                            {t.launchToken.telegram}
                          </Label>
                          <Input
                            placeholder={t.launchToken.exampleUsername}
                            value={formData.telegram}
                            onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 text-sm h-8 transition-all duration-200 hover:bg-white/10 hover:border-cyan-400/50 focus:bg-white/10 focus:border-cyan-400"
                          />
                        </div>

                        {/* Website */}
                        <div className="space-y-1 transition-all duration-200 ">
                          <Label className="text-xs text-white/70 flex items-center gap-1 transition-colors duration-200">
                            {t.launchToken.website}
                          </Label>
                          <Input
                            placeholder={t.launchToken.exampleDomain}
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 text-sm h-8 transition-all duration-200 hover:bg-white/10 hover:border-green-400/50 focus:bg-white/10 focus:border-green-400"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex gap-3 animate-in fade-in-0 slide-in-from-bottom-3 duration-500" style={{ animationDelay: showSocials ? '350ms' : '300ms' }}>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-semibold text-base py-2 transition-all duration-200  hover:shadow-lg hover:shadow-purple-500/50 active:scale-95"
                    >
                      <Rocket className="size-4 mr-2 transition-transform duration-200 group-hover:rotate-12" />
                      {t.launchToken.launchButton}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
