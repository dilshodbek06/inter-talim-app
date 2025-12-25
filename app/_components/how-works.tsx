import { ArrowRight, Trophy, Users, Zap } from "lucide-react";

const HowWorks = () => {
  const data = [
    {
      number: "01",
      icon: Users,
      title: "Ro‘yhatdan o‘ting",
      description:
        "Platforma imkoniyatlaridan to‘liq foydalanishingiz uchun ro‘yhatdan o‘ting.",
    },
    {
      number: "02",
      icon: Zap,
      title: "O‘yinlardan birini tanlang",
      description:
        "Muvaffaqiyatli ro‘yhatdan o‘tgandan so‘ng o‘yinlardan birini tanlang.",
    },
    {
      number: "03",
      icon: Trophy,
      title: "Birga O‘ynang va O‘rgating",
      description:
        "Qiziqarli, interaktiv o‘yinlar va vositalardan foydalanib dars sifatini oshiring.",
    },
  ];
  return (
    <section
      id="how-it-works"
      className="py-20 bg-muted/30"
      data-aos="fade-up"
      data-aos-offset="140"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Platforma qanday ishlaydi
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Uchta oddiy qadamda boshlang
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {data.map((step, index) => (
            <div
              key={index}
              className="relative"
              data-aos="zoom-in"
              data-aos-delay={100 + index * 100}
            >
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-bold text-secondary-foreground">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              {index < 2 && (
                <div className="hidden md:block absolute top-10 -right-4 w-8">
                  <ArrowRight className="w-8 h-8 text-primary/30" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWorks;
