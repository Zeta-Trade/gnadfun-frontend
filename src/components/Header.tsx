import { Logo } from './Logo';
import { WalletDropdown } from './WalletConnect/WalletDropdown';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useWallet } from '../hooks/useWallet';
import { PlusCircle, Search } from 'lucide-react';

interface HeaderProps {
  sticky?: boolean;
  className?: string;
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
}

export function Header({ sticky = false, className = '', searchTerm, setSearchTerm }: HeaderProps) {
  const stickyCls = sticky ? 'sticky top-0 z-40' : '';
  // const { language, setLanguage } = useGlobalContext();
  // const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const {
    account,
    connectWallet,
  } = useWallet();

  const handleLaunchTokenClick = useCallback(() => {
    // if (account) {
    navigate('/launch-token');
    //   return;
    // }

    // void connectWallet();

  }, [account, connectWallet, navigate]);

  return (
    <header className={`border-b border-white/10 bg-black/20 backdrop-blur-lg ${stickyCls} ${className}`.trim()}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            {setSearchTerm && (
              isSearchOpen ? (
                <div className="relative max-w-md">
                  <Input
                    type="text"
                    placeholder="Search tokens..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onBlur={() => setIsSearchOpen(false)}
                    className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                    autoFocus
                  />
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  className="text-white cursor-pointer hover:bg-white/10"
                >
                  <Search className="size-6" />
                </Button>
              )
            )}
            <div className="text-center">
              <Button
                onClick={handleLaunchTokenClick}
                className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 cursor-pointer"
              >
                <PlusCircle className="size-4" />
                Create
              </Button>
            </div>
            <WalletDropdown />
            {/* <DropdownMenu open={isLangOpen} onOpenChange={setIsLangOpen}> */}
            {/* <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="default"
                  className="cursor-pointer gap-2 px-4 py-2 border-purple-500/30 bg-transparent hover:bg-purple-500/20 text-purple-400 hover:text-white transition-all duration-200 h-9"
                >
                  <span className="text-sm font-medium">{language === 'en' ? 'EN' : '中文'}</span>
                  <ChevronDown
                    className={`size-4 transition-transform duration-200 ${isLangOpen ? "rotate-180" : ""}`}
                  />
                </Button>
              </DropdownMenuTrigger> */}
            {/* <DropdownMenuContent 
                align="end" 
                className="w-40 bg-slate-950/98 border border-purple-500/30 backdrop-blur-lg rounded-xl shadow-2xl p-2 space-y-1"
              >
                <DropdownMenuItem 
                  onClick={() => {
                    setLanguage('en');
                    setIsLangOpen(false);
                  }}
                  className="cursor-pointer px-4 py-2 text-white/80 hover:text-white focus:text-white hover:bg-purple-500/20 focus:bg-purple-500/20 rounded-lg mx-0 transition-all duration-200"
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    setLanguage('zh');
                    setIsLangOpen(false);
                  }}
                  className="cursor-pointer px-4 py-2 text-white/80 hover:text-white focus:text-white hover:bg-purple-500/20 focus:bg-purple-500/20 rounded-lg mx-0 transition-all duration-200"
                >
                  中文
                </DropdownMenuItem>
              </DropdownMenuContent> */}
            {/* </DropdownMenu> */}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
