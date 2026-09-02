import React from 'react';
import ArticleCard from './ArticleCard';
import artistProfile from '@/assets/images/artist-profile.jpg';
import artistHome from '@/assets/images/artist-home.png';
import heroImage from '@/assets/images/hero.jpg';
import musicImage from '@/assets/images/music.png';

const ArticleGrid = () => {
  const articles = [
    {
      image: artistProfile,
      title: "Pourquoi un artiste a-t-il besoin d'un manager ?",
      description:
        "Découvrez comment un manager accompagne la carrière d'un artiste et l'aide à transformer son talent en véritable projet professionnel.",
      body: [
        "Le talent est essentiel, mais il ne suffit pas toujours pour construire une carrière durable. Le manager accompagne l'artiste dans ses décisions, organise son calendrier, recherche des opportunités et facilite les relations avec les médias, les producteurs, les organisateurs et les partenaires.",
        "Il aide également l'artiste à définir son identité, préparer ses sorties musicales et développer une stratégie de communication cohérente. Pendant que l'artiste se concentre sur la création, le manager veille à la bonne organisation de sa carrière.",
        "Un bon manager ne décide pas à la place de l'artiste. Il l'écoute, le conseille et protège ses intérêts. Pour réussir cette collaboration, les responsabilités, les commissions et la durée du partenariat doivent être clairement définies dans un contrat.",
        "Bien choisir son manager, c'est choisir une personne de confiance capable de comprendre sa vision et de l'accompagner vers ses objectifs.",
      ],
      imageAspectRatio: "aspect-[1.79]",
      titleSize: "text-base",
      titleTracking: "tracking-[0.13px]",
      titleLeading: "leading-none",
      descriptionColor: "text-black/70",
      paddingBottom: "pb-1",
      minHeight: ""
    },
    {
      image: artistHome,
      title: "Comment protéger sa musique avant sa sortie ?",
      description:
        "Quelques précautions essentielles permettent aux artistes et producteurs de protéger leurs œuvres avant leur publication.",
      body: [
        "Avant de publier une chanson, l'artiste doit pouvoir prouver qu'il en est l'auteur ou qu'il possède les autorisations nécessaires pour l'exploiter.",
        "Il est important de conserver les différentes versions du morceau, les fichiers du studio, les dates de création et les échanges entre les collaborateurs. Les rôles de chaque participant, auteur, compositeur, interprète, beatmaker, producteur ou ingénieur du son, doivent être clairement précisés.",
        "Lorsqu'une œuvre est réalisée par plusieurs personnes, un accord écrit doit déterminer les droits et les parts de chacun. L'artiste doit également éviter de diffuser trop tôt une version complète de son morceau sur les réseaux sociaux.",
        "Protéger sa musique ne signifie pas seulement empêcher le vol. C'est aussi organiser correctement ses droits afin de pouvoir diffuser, promouvoir et monétiser son œuvre dans de bonnes conditions.",
      ],
      imageAspectRatio: "aspect-[1.96]",
      titleSize: "text-lg",
      titleTracking: "tracking-[-1px]",
      titleLeading: "leading-[1.4]",
      descriptionColor: "text-[rgba(102,102,102,1)]",
      paddingBottom: "pb-[46px]",
      minHeight: "h-[437px]"
    },
    {
      image: heroImage,
      title: "Protéger notre culture, c'est préserver notre avenir",
      description:
        "Nos langues, nos rythmes et nos histoires constituent une mémoire précieuse qu'il faut transmettre aux générations futures.",
      body: [
        "La culture raconte qui nous sommes. Elle vit dans nos langues, nos chants, nos instruments, nos danses et les histoires transmises par nos parents.",
        "Lorsqu'une musique traditionnelle disparaît sans avoir été enregistrée, c'est une partie de notre mémoire collective qui s'efface. Les artistes ont donc un rôle essentiel : créer, documenter et transmettre notre patrimoine avec les outils d'aujourd'hui.",
        "Le numérique permet de conserver nos œuvres et de les rendre accessibles partout dans le monde. Une chanson diffusée en ligne peut reconnecter un jeune à ses origines et faire découvrir la richesse culturelle tchadienne à de nouveaux publics.",
        "Protéger notre culture, ce n'est pas refuser la modernité. C'est utiliser la modernité pour donner une nouvelle vie à notre héritage et le transmettre avec fierté.",
      ],
      imageAspectRatio: "aspect-[1.86]",
      titleSize: "text-lg",
      titleTracking: "tracking-[-1px]",
      titleLeading: "leading-[25px]",
      descriptionColor: "text-[rgba(102,102,102,1)]",
      paddingBottom: "",
      minHeight: "h-[437px]"
    },
    {
      image: musicImage,
      title: "Pourquoi choisir AsraPa pour diffuser votre musique ?",
      description:
        "AsraPa offre aux artistes un espace consacré à la découverte, à la valorisation et au rayonnement de la musique tchadienne.",
      body: [
        "AsraPa est une plateforme conçue pour rapprocher les artistes tchadiens de leur public, au Tchad comme dans la diaspora.",
        "Choisir AsraPa, c'est rejoindre un espace qui comprend notre musique, nos réalités et la diversité de notre culture. Chaque artiste peut y présenter son univers, faire découvrir ses œuvres et renforcer sa relation avec ses auditeurs.",
        "Pour le public, AsraPa permet de retrouver plus facilement les artistes, les chansons et les sonorités qui représentent le Tchad. Pour les créateurs, la plateforme constitue une nouvelle vitrine numérique capable d'accompagner leur visibilité et le développement de leur carrière.",
        "En choisissant AsraPa, artistes et auditeurs participent ensemble à la construction d'un écosystème musical plus fort. Notre musique mérite d'être écoutée, valorisée et transmise. AsraPa lui offre un espace pour rayonner.",
      ],
      imageAspectRatio: "aspect-[1.96]",
      titleSize: "text-lg",
      titleTracking: "tracking-[-1px]",
      titleLeading: "leading-[25px]",
      descriptionColor: "text-[rgba(102,102,102,1)]",
      paddingBottom: "",
      minHeight: "h-[437px]"
    }
  ];

  return (
    <main className="self-center z-10 flex mt-[-92px] w-full max-w-[1221px] gap-[30px] font-bold text-center flex-wrap justify-center max-md:max-w-full">
      {articles.map((article, index) => (
        <ArticleCard
          key={index}
          image={article.image}
          title={article.title}
          description={article.description}
          body={article.body}
          imageAspectRatio={article.imageAspectRatio}
          titleSize={article.titleSize}
          titleTracking={article.titleTracking}
          titleLeading={article.titleLeading}
          descriptionColor={article.descriptionColor}
          paddingBottom={article.paddingBottom}
          minHeight={article.minHeight}
        />
      ))}
    </main>
  );
};

export default ArticleGrid;
