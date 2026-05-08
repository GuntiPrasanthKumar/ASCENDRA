import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

export default function AboutUs() {
  const team = [
    { name: 'Dr. Emily Chen', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
    { name: 'Marcus Johnson', role: 'Head of Engineering', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
    { name: 'Sarah Williams', role: 'Lead Designer', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-32 pb-20 px-6 overflow-hidden">
        
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-32 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-accent/10 rounded-[100%] blur-3xl pointer-events-none" />
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-extrabold text-primary mb-6 relative z-10"
          >
            Redefining <span className="text-accent">Integrity</span> in Digital Education
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-textMuted font-body relative z-10 max-w-2xl mx-auto"
          >
            SkillTrove was built to bridge the gap between rigorous assessment security and a beautiful, stress-free student experience.
          </motion.p>
        </div>

        {/* Team Section */}
        <div className="max-w-7xl mx-auto mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-primary mb-4">Meet the Visionaries</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, rotateY: -30, z: -100 }}
                whileInView={{ opacity: 1, rotateY: 0, z: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                className="group relative h-96 [transform-style:preserve-3d] hover:[transform:rotateY(180deg)] transition-all duration-1000 cursor-pointer"
              >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden">
                  <div className="w-full h-full rounded-3xl overflow-hidden relative">
                    <img src={member.img} alt={member.name} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8">
                      <h3 className="text-white text-2xl font-bold font-display">{member.name}</h3>
                      <p className="text-accent2 font-medium">{member.role}</p>
                    </div>
                  </div>
                </div>
                
                {/* Back */}
                <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)]">
                  <div className="w-full h-full rounded-3xl glass-dark flex flex-col items-center justify-center p-8 text-center border-accent/30">
                    <h3 className="text-white text-2xl font-bold font-display mb-2">{member.name}</h3>
                    <p className="text-white/70 italic">"Committed to building technology that empowers both educators and learners without compromising on ethics."</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-primary mb-4">Why SkillTrove?</h2>
          </div>
          
          <div className="glass rounded-3xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-muted bg-white/40">
                  <th className="p-6 font-display font-bold text-primary text-lg">Feature</th>
                  <th className="p-6 font-display font-bold text-accent text-lg bg-accent/5">SkillTrove</th>
                  <th className="p-6 font-display font-bold text-textMuted text-lg">Traditional Platforms</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Advanced AI Proctoring', true, false],
                  ['Adaptive Question Scaling', true, false],
                  ['Premium 3D User Interface', true, false],
                  ['Integrated Code Editor', true, true],
                  ['Community Forums (Echo)', true, false],
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-muted/50 last:border-0 hover:bg-white/50 transition-colors">
                    <td className="p-6 font-medium text-primary">{row[0]}</td>
                    <td className="p-6 bg-accent/5">
                      {row[1] ? <Check className="w-6 h-6 text-accent" /> : <span className="text-textMuted">-</span>}
                    </td>
                    <td className="p-6">
                      {row[2] ? <Check className="w-6 h-6 text-textMuted" /> : <span className="text-textMuted">-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
      
      {/* Required CSS for 3D Flip Cards */}
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 { perspective: 1000px; }
        .backface-hidden { backface-visibility: hidden; }
      `}} />
    </PageTransition>
  );
}
