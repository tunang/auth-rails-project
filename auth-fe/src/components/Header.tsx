import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const navigate = useNavigate();

  // Mock data - sẽ được thay thế bằng state management thực tế
  const isLoggedIn = false;
  const cartItemCount = 3;
  const userName = "Nguyễn Văn A";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    { name: "Sách trong nước", count: "12,000+" },
    { name: "Sách nước ngoài", count: "8,000+" },
    { name: "VPP - Dụng cụ học tập", count: "3,000+" },
    { name: "Quà lưu niệm", count: "500+" },
    { name: "Sách điện tử", count: "2,000+" },
  ];



  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-red-600 text-white text-xs">
        <div className="container mx-auto px-4 py-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span>📞 Hotline: 1900-636-467</span>
              <span>📍 106 cửa hàng toàn quốc</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <span>Miễn phí giao hàng với đơn từ 150k</span>
              <span>Ứng dụng di động</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-red-600 text-white p-2 rounded-lg">
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.09-.21 2.28-.71 3.33-1.36C16.97 24.29 20.16 21.14 22 17c0-5.55-3.84-10-9-11zm0 2.18c4.16.79 7 3.7 7 7.82 0 4.12-2.84 7.03-7 7.82V4.18z"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-red-600">FAHASA</span>
              <span className="text-xs text-gray-500">Thế giới trong tầm tay</span>
            </div>
          </Link>

          {/* Categories Dropdown */}
          <div className="hidden lg:block">
            <DropdownMenu open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-orange-500 text-white border-orange-500 hover:bg-orange-600 ml-8"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  Danh mục sản phẩm
                  <svg className="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="start">
                {categories.map((category, index) => (
                  <DropdownMenuItem key={index} asChild>
                    <Link to={`/category/${index + 1}`} className="flex justify-between">
                      <span>{category.name}</span>
                      <span className="text-gray-400 text-xs">({category.count})</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search Bar */}
          <div className="flex flex-1 items-center justify-center px-4 lg:px-6">
            <form onSubmit={handleSearch} className="w-full max-w-2xl">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Tìm kiếm sách, văn phòng phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 pr-12 border-2 border-red-200 focus:border-red-500 rounded-lg"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1 h-9 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </Button>
              </div>

            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="relative text-gray-600 hover:text-red-600 flex items-center space-x-1">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                <span className="hidden lg:inline-block text-sm">Giỏ hàng</span>
                {cartItemCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative flex items-center space-x-2 text-gray-600 hover:text-red-600">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-red-100 text-red-600">{userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline-block text-sm">Tài khoản</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{userName}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        user@example.com
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/orders">📦 Đơn hàng của tôi</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/address">📍 Sổ địa chỉ</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">👤 Thông tin cá nhân</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    🚪 Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button asChild variant="ghost" size="sm" className="text-gray-600 hover:text-red-600">
                  <Link to="/login" className="flex items-center space-x-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="hidden lg:inline-block">Đăng nhập</span>
                  </Link>
                </Button>
                <Button asChild size="sm" className="bg-red-600 hover:bg-red-700">
                  <Link to="/register">
                    <span className="hidden text-white lg:inline-block">Đăng ký</span>
                    <span className="lg:hidden">DK</span>
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="border-t lg:hidden bg-white shadow-lg">
            <div className="px-4 py-4">
              {/* Mobile Categories */}
              <div className="mb-4 px-2">
                <h3 className="font-semibold text-gray-800 mb-3">Danh mục sản phẩm</h3>
                <div className="grid grid-cols-1 gap-1">
                  {categories.map((category, index) => (
                    <Link
                      key={index}
                      to={`/category/${index + 1}`}
                      className="text-sm text-gray-600 py-2 px-2 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;