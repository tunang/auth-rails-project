import { useState, useEffect } from "react";
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
import { useAppSelector } from "@/hooks/useAppDispatch";
import { ListOrderedIcon, LogOutIcon, MapPinIcon, ShieldIcon, UserIcon } from "lucide-react";
import { categoryApi } from "@/services/category.api";
import type { Category } from "@/types/category.type";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const navigate = useNavigate();

  const {user, isAuthenticated} = useAppSelector((state) => state.auth);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await categoryApi.user.getCategories();
        console.log("Categories API response:", response);
        console.log("Categories data:", response.data);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);


  // Component để render danh mục con
  const renderSubCategories = (children: Category[] | null | undefined) => {
    if (!children || !Array.isArray(children) || children.length === 0) return null;
    
    return (
      <div className="ml-4 border-l border-gray-200 pl-3 mt-2">
        {children.map((child) => (
          <div key={child.id} className="mb-2">
            <Link 
              to={`/category/${child.id}`}
              className="block text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
            >
              {child.name}
            </Link>
            {child.children && Array.isArray(child.children) && child.children.length > 0 && renderSubCategories(child.children)}
          </div>
        ))}
      </div>
    );
  };



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
              <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto" align="start">
                {isLoadingCategories ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-2 text-sm">Đang tải danh mục...</p>
                  </div>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <div key={category.id} className="p-2">
                      <DropdownMenuItem asChild>
                        <Link 
                          to={`/category/${category.id}`}
                          className="flex justify-between font-medium text-gray-800 hover:text-red-600"
                        >
                        <span>{category.name}</span>
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                      </Link>
                    </DropdownMenuItem>
                      {renderSubCategories(category.children)}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <p className="text-sm">Không có danh mục nào</p>
                  </div>
                )}
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
         
              </Button>
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative flex items-center space-x-2 text-gray-600 hover:text-red-600">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-red-100 text-red-600">{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline-block text-sm">Tài khoản</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/orders"><ListOrderedIcon /> Đơn hàng của tôi</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                      <Link to="/address"><MapPinIcon /> Sổ địa chỉ</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile"><UserIcon /> Thông tin cá nhân</Link>
                  </DropdownMenuItem>

                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin"><ShieldIcon /> Quản trị</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOutIcon /> Đăng xuất
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
                  {isLoadingCategories ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
                      <p className="mt-2 text-sm">Đang tải danh mục...</p>
                    </div>
                  ) : categories.length > 0 ? (
                    categories.map((category) => (
                      <div key={category.id} className="mb-2">
                      <Link
                          to={`/category/${category.id}`}
                          className="text-sm font-medium text-gray-800 py-2 px-2 hover:bg-red-50 hover:text-red-600 rounded transition-colors flex justify-between items-center"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {category.name}
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                        {/* Mobile Sub Categories */}
                        {category.children && Array.isArray(category.children) && category.children.length > 0 && (
                          <div className="ml-4 mt-1">
                            {category.children.map((child) => (
                              <div key={child.id} className="mb-1">
                                <Link
                                  to={`/category/${child.id}`}
                                  className="text-xs text-gray-600 py-1 px-2 hover:bg-red-50 hover:text-red-600 rounded transition-colors block"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  • {child.name}
                                </Link>
                                {/* Third level categories */}
                                {child.children && Array.isArray(child.children) && child.children.length > 0 && (
                                  <div className="ml-4 mt-1">
                                    {child.children.map((grandChild) => (
                                      <Link
                                        key={grandChild.id}
                                        to={`/category/${grandChild.id}`}
                                        className="text-xs text-gray-500 py-1 px-2 hover:bg-red-50 hover:text-red-600 rounded transition-colors block"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                      >
                                        ◦ {grandChild.name}
                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">Không có danh mục nào</p>
                    </div>
                  )}
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