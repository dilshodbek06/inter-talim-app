import { Card, CardContent } from "@/components/ui/card";
import { Gamepad2, MonitorCog, MonitorSmartphone, PenTool } from "lucide-react";

const Features = () => {
  const data = [
    {
      icon: Gamepad2,
      title: "Ta'limiy o‘yinlar",
      description: "O‘rganishni qiziqarli qiladigan interaktiv o‘yinlar",
      color: "bg-sky-500/20",
      textColor: "text-sky-500",
    },
    {
      icon: PenTool,
      title: "Samarali vositalar",
      description: "Topshiriq berish uchun qiziqarli vositalar",
      color: "bg-pink-500/20",
      textColor: "text-pink-500",
    },
    {
      icon: MonitorCog,
      title: "Qulay interfeys",
      description: "Chiroyli va yengil foydalanuvchi interfeysi",
      color: "bg-purple-500/20",
      textColor: "text-purple-500",
    },
    {
      icon: MonitorSmartphone,
      title: "Mobil moslashuv",
      description: "Barcha qurilmalar uchun moslashuvchan UI",
      color: "bg-green-500/20",
      textColor: "text-green-500",
    },
  ];

  return (
    <section id="features" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold">
            Platforma xususiyatlari
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Zamonaviy o‘quvchilar va ustozlar uchun{" "}
            <br className="hidden md:block" />
            samarali vositalar
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border hover:border-primary/50 bg-card animate-fade-in shadow-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 space-y-4">
                <div
                  className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`w-7 h-7 ${feature.textColor}`} />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
