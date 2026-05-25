import { HomeNavbar } from '../components/HomeNavbar';
import { HomeHero } from '../components/HomeHero';
import { HomeCategories } from '../components/HomeCategories';
import { HomeAchievements } from '../components/HomeAchievements';
import { HomeFooter } from '../components/HomeFooter';

export function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col overflow-x-hidden">
      <HomeNavbar />
      <HomeHero />
      <HomeCategories />
      <HomeAchievements />
      <HomeFooter />
    </div>
  );
}
