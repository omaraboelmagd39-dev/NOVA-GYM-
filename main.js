document.addEventListener("DOMContentLoaded",()=>{
  const loader=document.querySelector(".preloader");
  window.addEventListener("load",()=>loader?.classList.add("done"));
  setTimeout(()=>loader?.classList.add("done"),1600);

  const header=document.querySelector(".header");
  const menuBtn=document.querySelector(".menu-btn");
  const menu=document.querySelector(".nav-menu");
  const closeMenu=()=>{menu?.classList.remove("open");menuBtn?.setAttribute("aria-expanded","false");document.body.classList.remove("menu-open")};
  menuBtn?.addEventListener("click",()=>{
    const open=menuBtn.getAttribute("aria-expanded")!=="true";
    menuBtn.setAttribute("aria-expanded",String(open));
    menu?.classList.toggle("open",open);
    document.body.classList.toggle("menu-open",open);
  });
  document.querySelectorAll(".nav-link").forEach(a=>a.addEventListener("click",closeMenu));
  window.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu()});
  const onScroll=()=>header?.classList.toggle("scrolled",window.scrollY>25);
  onScroll();window.addEventListener("scroll",onScroll,{passive:true});

  const reveals=document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}
    }),{threshold:.12});
    reveals.forEach(el=>observer.observe(el));
  }else reveals.forEach(el=>el.classList.add("visible"));

  const countUp=el=>{
    const target=Number(el.dataset.count||0),start=performance.now(),duration=1200;
    const tick=now=>{const p=Math.min((now-start)/duration,1);el.textContent=Math.round(target*(1-Math.pow(1-p,3)).toFixed(4)).toLocaleString("en-US");if(p<1)requestAnimationFrame(tick)};
    requestAnimationFrame(tick);
  };
  if("IntersectionObserver" in window){
    const counterObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){countUp(entry.target);counterObserver.unobserve(entry.target)}}),{threshold:.8});
    document.querySelectorAll("[data-count]").forEach(el=>counterObserver.observe(el));
  }else document.querySelectorAll("[data-count]").forEach(countUp);

  const planSelect=document.querySelector("#plan-choice");
  document.querySelectorAll("[data-plan]").forEach(a=>a.addEventListener("click",()=>{
    const value=a.dataset.plan;
    const option=[...(planSelect?.options||[])].find(o=>o.textContent.toLowerCase()===value.toLowerCase());
    if(option)planSelect.value=option.value;
  }));

  const toast=document.querySelector(".toast");let toastTimer;
  const showToast=msg=>{if(!toast)return;toast.textContent=msg;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),4000)};
  const WHATSAPP_NUMBER="201000000000"; // غيّر الرقم التجريبي إلى رقم النادي بصيغة دولية دون +.
  document.querySelector("#contact-form")?.addEventListener("submit",e=>{
    e.preventDefault();const form=e.currentTarget;if(!form.reportValidity())return;
    if(WHATSAPP_NUMBER==="201000000000"){showToast("قبل النشر، غيّر رقم واتساب التجريبي داخل js/main.js إلى رقم النادي الحقيقي.");return}
    const d=new FormData(form);
    const message=["مرحبًا IRON DISTRICT، أرغب في الاستفسار عن العضوية.",`الاسم: ${d.get("name")}`,`الموبايل: ${d.get("phone")}`,`العضوية: ${d.get("plan")}`,`الرسالة: ${d.get("notes")||"لا توجد"}`].join("\\n");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank","noopener,noreferrer");
  });
  const year=document.querySelector("#year");if(year)year.textContent=new Date().getFullYear();
});