import { Button } from "@/components/ui/button";
import { BookOpen, Star, TrendingUp } from "lucide-react";

const HomePage = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-6">
            Chào mừng đến với BookStore
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Khám phá thế giới sách với hàng ngàn đầu sách từ các tác giả nổi tiếng
            trên toàn thế giới. Tìm kiếm, đọc và sưu tập những cuốn sách yêu thích của bạn.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Khám phá ngay
            </Button>
            <Button variant="outline" size="lg">
              Xem bộ sưu tập
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tại sao chọn BookStore?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Thư viện đa dạng</h3>
              <p className="text-muted-foreground">
                Hơn 10,000 đầu sách từ nhiều thể loại khác nhau
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Chất lượng cao</h3>
              <p className="text-muted-foreground">
                Chỉ những cuốn sách được đánh giá cao và chất lượng tốt nhất
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cập nhật liên tục</h3>
              <p className="text-muted-foreground">
                Những cuốn sách mới nhất được cập nhật hàng tuần
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <p className="text-muted-foreground">Đầu sách</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <p className="text-muted-foreground">Khách hàng hài lòng</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">99%</div>
              <p className="text-muted-foreground">Đánh giá tích cực</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;