'use client';

import { useEffect, useRef, useState, FormEvent } from 'react';
import styles from './page.module.css';

export default function Contact() {
  const logoRef = useRef<HTMLDivElement>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  // Parallax para el logo
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!logoRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      logoRef.current.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const parent = e.target.parentElement;
    if (parent) {
      parent.style.transform = 'translateX(5px)';
      setTimeout(() => {
        parent.style.transform = 'translateX(0)';
      }, 300);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Obtenemos los datos  
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Combinar asunto
    const userSubject = formData.get('subject_msg') as string;
    if (userSubject) {
      formData.set('subject', `Contacto X+M² - ${userSubject}`);
    }
    formData.delete('subject_msg');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        setFormStatus('success');
        form.reset();
      } else {
        throw new Error(data.message || 'Error al enviar');
      }
    } catch (error) {
      console.error(error);
      setFormStatus('error');
    }

    // Reset tras 3 segundos
    setTimeout(() => {
      setFormStatus('idle');
    }, 3000);
  };

  return (
    <main className={styles.container}>
      {/* Sección izquierda: Branding */}
      <section className={styles.brandSection}>
        <div className={styles.logoContainer}>
          <div className={styles.logo} ref={logoRef}>
            X+M<sup>2</sup>
          </div>
          <div className={styles.tagline}>arquitectos | studio + taller</div>
        </div>

        <div className={styles.contactInfoVertical}>
          <a href="mailto:xmasm2arquitectos@gmail.com">xmasm2arquitectos@gmail.com</a>
          <span>+56 9 3720 2177</span>
        </div>
      </section>

      {/* Sección derecha: Formulario y contacto */}
      <section className={styles.contentSection}>
        <div className={styles.nameBlock}>
          <h1 className={styles.name}>Ricardo Andrés<br />Manríquez Menares</h1>
          <p className={styles.title}>Socio Fundador y Director de Proyectos</p>
        </div>

        <form className={styles.contactForm} onSubmit={handleSubmit}>
          {/* Web3Forms Access Key */}
          <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY" />
          <input type="hidden" name="subject" value="Nuevo contacto - X+M² arquitectos" />
          <input type="hidden" name="from_name" value="Web X+M² arquitectos" />
          <input type="checkbox" name="botcheck" style={{ display: 'none' }} />

          <div className={styles.formGroup}>
            <input type="text" id="name" name="name" placeholder=" " required onFocus={handleFocus} />
            <label htmlFor="name">Nombre</label>
          </div>

          <div className={styles.formGroup}>
            <input type="email" id="email" name="email" placeholder=" " required onFocus={handleFocus} />
            <label htmlFor="email">Email</label>
          </div>

          <div className={styles.formGroup}>
            <input type="text" id="subject_msg" name="subject_msg" placeholder=" " onFocus={handleFocus} />
            <label htmlFor="subject_msg">Asunto</label>
          </div>

          <div className={styles.formGroup}>
            <textarea id="message" name="message" placeholder=" " required onFocus={handleFocus}></textarea>
            <label htmlFor="message">Mensaje</label>
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn} 
            disabled={formStatus === 'submitting'}
            style={{
              background: formStatus === 'success' ? 'var(--text-primary)' : '',
              color: formStatus === 'success' ? 'var(--bg-dark)' : formStatus === 'error' ? 'rgba(255,150,150,0.9)' : '',
              borderColor: formStatus === 'error' ? 'rgba(255,100,100,0.6)' : ''
            }}
          >
            {formStatus === 'idle' && 'Enviar'}
            {formStatus === 'submitting' && 'Enviando...'}
            {formStatus === 'success' && '✓ Mensaje Enviado'}
            {formStatus === 'error' && '✗ Error — Intenta de nuevo'}
          </button>
        </form>

        <div className={styles.footerInfo}>
          <a href="https://www.xmasm2arquitectos.cl" className={styles.website} target="_blank" rel="noreferrer">
            www.xmasm2arquitectos.cl
          </a>
          <span className={styles.social}>@xmasm2arquitectos</span>
        </div>
      </section>
    </main>
  );
}
