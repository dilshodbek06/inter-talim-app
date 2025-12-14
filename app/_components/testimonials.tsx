import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Dilnoza Karimova",
      role: "7-sinf o‘qituvchisi",
      avatar: "👩‍🏫",
      quote:
        "Sinfim bu o‘yinlarga juda qiziqadi! Platformadan foydalangandan beri darsdagi faollik sezilarli oshdi.",
      rating: 5,
    },
    {
      name: "Javohir Akmalov",
      role: "O‘rta maktab o‘quvchisi",
      avatar: "👨‍🎓",
      quote:
        "O'yinlar juda qiziqarli! O‘qish endi majburiyat emas, zavq. Baholarim esa ancha yaxshilandi.",
      rating: 5,
    },
    {
      name: "Mushtariy Abdullayeva",
      role: "Boshlang‘ich sinf o‘qituvchisi",
      avatar: "👩‍🏫",
      quote:
        "Tayyorgarlik uchun vaqtim juda tejaldi. Platforma juda qulay va foydali.",
      rating: 5,
    },
    {
      name: "Sardorbek Mahmudov",
      role: "5-sinf o‘quvchisi",
      avatar: "👨‍🎓",
      quote:
        "Interaktiv o‘yinlar sabab dars qilish ancha maroqli bo‘ldi. Uy vazifasini bajarishni kutadigan bo‘ldim!",
      rating: 4,
    },
    {
      name: "Zamira Raxmatova",
      role: "Maktab o‘qituvchisi",
      avatar: "👩‍🏫",
      quote:
        "Platformada qiziqarli o'yinlar bor ekan. Dars jarayoni qiziqarli bo'ldi. Tavsiya qilaman.",
      rating: 5,
    },
  ];

  return (
    <section
      id="testimonials"
      className="py-20 bg-linear-to-r from-edu-blue/10 via-edu-yellow/10 to-edu-coral/10 dark:from-edu-blue/5 dark:via-edu-yellow/5 dark:to-edu-coral/5 relative"
    >
      <div className="absolute top-10 left-10 w-20 h-20 bg-edu-yellow/20 rounded-full blur-xl" />
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-edu-coral/20 rounded-full blur-xl" />
      <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-edu-blue/20 rounded-full blur-xl" />
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:mx-auto md:max-w-4xl md:text-5xl font-bold">
            Ustoz va o‘quvchilarning sevimli platformasi
          </h2>
          <p className="text-xl text-muted-foreground">
            Platforma haqida foydalanuvchilar fikri
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="mb-16">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6 space-y-4 h-full flex flex-col">
                        <div className="flex gap-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-5 h-5 fill-secondary text-secondary"
                            />
                          ))}
                        </div>
                        <p className="text-foreground italic grow">
                          &quot;{testimonial.quote}&quot;
                        </p>
                        <div className="flex items-center gap-3 pt-4 border-t border-border">
                          <div className="text-4xl">{testimonial.avatar}</div>
                          <div>
                            <div className="font-bold">{testimonial.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {testimonial.role}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Buttons at Bottom Center */}
            <div className="flex items-center justify-center gap-4">
              <CarouselPrevious className="relative inset-auto translate-y-0 translate-x-0" />
              <CarouselNext className="relative inset-auto translate-y-0 translate-x-0" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
