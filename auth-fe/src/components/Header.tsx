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
import { ListOrderedIcon, LogOutIcon, MapPinIcon, ShieldIcon, UserIcon, BookOpenIcon, SearchIcon, ShoppingCartIcon, MenuIcon, XIcon } from "lucide-react";
import { categoryApi } from "@/services/category.api";
import type { Category } from "@/types/category.type";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {user, isAuthenticated} = useAppSelector((state) => state.auth);

  // Debug logging (can be removed in production)

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
        setCategoriesError(null);
        const response = await categoryApi.user.getCategories();
        
        // Ensure we set an array, fallback to empty array if data is not array
        const categoriesData = Array.isArray(response.categories) ? response.categories : [];
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategoriesError(error instanceof Error ? error.message : "Unknown error");
        setCategories([]); // Set empty array on error
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
    <header className="sticky top-0 z-50 w-full bg-white shadow-lg border-b border-amber-100">
      {/* Top Bar */}
      <div className="bg-amber-800 text-amber-50 text-sm">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <span className="flex items-center space-x-1">
                <span>📞</span>
                <span>Hotline: 1900-636-467</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>📍</span>
                <span>106 cửa hàng toàn quốc</span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <span>Miễn phí giao hàng với đơn từ 150k</span>
              <span>Ứng dụng di động</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="bg-amber-600 text-white p-3 rounded-xl shadow-md group-hover:bg-amber-700 transition-colors">
              <BookOpenIcon className="h-8 w-8" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-amber-700 group-hover:text-amber-800 transition-colors">FAHASA</span>
              <span className="text-sm text-amber-600 font-medium">Thế giới trong tầm tay</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex flex-1 items-center justify-center px-8">
            <form onSubmit={handleSearch} className="w-full max-w-2xl">
              <div className="relative flex items-center">
                {/* Categories Dropdown */}
                <DropdownMenu open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="bg-amber-600 text-white border-amber-600 hover:bg-amber-700 mr-2 h-12 px-4 rounded-l-xl rounded-r-none"
                    >
                      <MenuIcon className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[800px] max-h-[600px] p-6" align="start">
                    {isLoadingCategories ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                        <p className="ml-3 text-amber-700 font-medium">Đang tải danh mục...</p>
                      </div>
                    ) : categoriesError ? (
                      <div className="text-center py-12">
                        <p className="text-red-600 font-medium mb-4">Lỗi tải danh mục: {categoriesError}</p>
                        <button 
                          onClick={() => window.location.reload()} 
                          className="text-amber-600 underline hover:text-amber-700 font-medium"
                        >
                          Thử lại
                        </button>
                      </div>
                    ) : categories && categories.length > 0 ? (
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {categories.map((category) => (
                          <div key={category.id} className="group">
                            <Link 
                              to={`/category/${category.id}`}
                              className="block p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-all duration-200 border border-amber-200 hover:border-amber-300 hover:shadow-md"
                            >
                              <div className="text-center">
                                <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-amber-300 transition-colors">
                                  <BookOpenIcon className="h-5 w-5 text-amber-700" />
                                </div>
                                <h3 className="font-semibold text-gray-800 group-hover:text-amber-800 transition-colors text-sm leading-tight">
                                  {category.name}
                                </h3>
                              </div>
                            </Link>
                            
                            {/* Sub Categories */}
                            {category.children && Array.isArray(category.children) && category.children.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {category.children.map((child) => (
                                  <Link
                                    key={child.id}
                                    to={`/category/${child.id}`}
                                    className="block text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-100 px-2 py-1 rounded transition-colors"
                                  >
                                    • {child.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500 font-medium">Không có danh mục nào</p>
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Input
                  type="search"
                  placeholder="Tìm kiếm sách, văn phòng phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 pr-14 border-2 border-amber-200 focus:border-amber-400 rounded-r-xl rounded-l-none text-base shadow-sm"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-2 h-8 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-sm"
                >
                  <SearchIcon className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-6">
            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="relative text-amber-700 hover:text-amber-800 hover:bg-amber-50 flex items-center space-x-2 px-4 py-2 rounded-lg">
                <ShoppingCartIcon className="h-5 w-5" />
                <span className="hidden lg:inline-block text-sm font-medium">Giỏ hàng</span>
              </Button>
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative flex items-center space-x-2 text-amber-700 hover:text-amber-800 hover:bg-amber-50 px-4 py-2 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-amber-100 text-amber-700 font-semibold">{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline-block text-sm font-medium">Tài khoản</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <div className="flex items-center justify-start gap-3 p-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-amber-100 text-amber-700 font-semibold">{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-semibold text-gray-900">{user?.name}</p>
                      <p className="w-[200px] truncate text-sm text-gray-600">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="p-3">
                    <Link to="/orders" className="flex items-center space-x-2"><ListOrderedIcon className="h-4 w-4" /> <span>Đơn hàng của tôi</span></Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-3">
                    <Link to="/address" className="flex items-center space-x-2"><MapPinIcon className="h-4 w-4" /> <span>Sổ địa chỉ</span></Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-3">
                    <Link to="/profile" className="flex items-center space-x-2"><UserIcon className="h-4 w-4" /> <span>Thông tin cá nhân</span></Link>
                  </DropdownMenuItem>

                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild className="p-3">
                      <Link to="/admin" className="flex items-center space-x-2"><ShieldIcon className="h-4 w-4" /> <span>Quản trị</span></Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 p-3">
                    <LogOutIcon className="h-4 w-4 mr-2" /> Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Button asChild variant="ghost" size="sm" className="text-amber-700 hover:text-amber-800 hover:bg-amber-50 px-4 py-2 rounded-lg">
                  <Link to="/login" className="flex items-center space-x-2">
                    <UserIcon className="h-4 w-4" />
                    <span className="hidden lg:inline-block font-medium">Đăng nhập</span>
                  </Link>
                </Button>
                <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg shadow-sm">
                  <Link to="/register">
                    <span className="hidden lg:inline-block font-medium">Đăng ký</span>
                    <span className="lg:hidden font-medium">DK</span>
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
                className="text-amber-700 hover:text-amber-800 hover:bg-amber-50 p-2 rounded-lg"
              >
                {isMobileMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>


        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="border-t border-amber-100 lg:hidden bg-white shadow-lg">
            <div className="px-4 py-6">
              {/* Mobile Categories */}
              <div className="mb-6">
                <h3 className="font-semibold text-amber-800 mb-4 text-lg">Danh mục sản phẩm</h3>
                <div className="grid grid-cols-1 gap-2">
                  {isLoadingCategories ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
                      <p className="ml-3 text-amber-700">Đang tải danh mục...</p>
                    </div>
                  ) : categoriesError ? (
                    <div className="text-center py-8">
                      <p className="text-red-600 mb-4">Lỗi tải danh mục: {categoriesError}</p>
                      <button 
                        onClick={() => window.location.reload()} 
                        className="text-amber-600 underline"
                      >
                        Thử lại
                      </button>
                    </div>
                  ) : categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <div key={category.id} className="mb-3">
                        <Link
                          to={`/category/${category.id}`}
                          className="text-sm font-medium text-gray-800 py-3 px-4 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition-colors flex justify-between items-center bg-gray-50"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {category.name}
                          <BookOpenIcon className="h-4 w-4" />
                        </Link>
                        {/* Mobile Sub Categories */}
                        {category.children && Array.isArray(category.children) && category.children.length > 0 && (
                          <div className="ml-4 mt-2 space-y-1">
                            {category.children.map((child) => (
                              <div key={child.id} className="mb-1">
                                <Link
                                  to={`/category/${child.id}`}
                                  className="text-xs text-amber-600 py-2 px-3 hover:bg-amber-100 hover:text-amber-700 rounded transition-colors block"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  • {child.name}
                                </Link>
                                {/* Third level categories */}
                                {child.children && Array.isArray(child.children) && child.children.length > 0 && (
                                  <div className="ml-4 mt-1 space-y-1">
                                    {child.children.map((grandChild) => (
                                      <Link
                                        key={grandChild.id}
                                        to={`/category/${grandChild.id}`}
                                        className="text-xs text-gray-500 py-1 px-3 hover:bg-amber-50 hover:text-amber-600 rounded transition-colors block"
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
                    <div className="text-center py-8">
                      <p className="text-gray-500">Không có danh mục nào</p>
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