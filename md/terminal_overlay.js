  showTerminalOverlay(app) {
    const overlay = this.createBaseOverlay();
    overlay.style.alignItems = 'center';
    
    const title = document.createElement('h2');
    title.textContent = "SECURE COMMS LINK";
    title.style.margin = '0 0 40px 0';
    title.style.fontSize = '24px';
    title.style.letterSpacing = '4px';
    title.style.borderBottom = '1px solid #333';
    title.style.paddingBottom = '20px';
    title.style.width = '100%';
    title.style.textAlign = 'center';

    const btnWrapper = document.createElement('div');
    btnWrapper.style.display = 'flex';
    btnWrapper.style.flexDirection = 'column';
    btnWrapper.style.gap = '20px';
    btnWrapper.style.width = '100%';

    const createLinkBtn = (text, url, highlight) => {
        const btn = document.createElement('a');
        btn.textContent = text;
        btn.href = url;
        btn.target = '_blank';
        btn.style.padding = '15px';
        btn.style.background = highlight ? '#fff' : 'transparent';
        btn.style.color = highlight ? '#000' : '#888';
        btn.style.border = highlight ? 'none' : '1px solid #333';
        btn.style.textDecoration = 'none';
        btn.style.fontWeight = 'bold';
        btn.style.fontSize = '14px';
        btn.style.letterSpacing = '2px';
        btn.style.textAlign = 'center';
        btn.style.transition = 'all 0.3s ease';
        if (!highlight) {
            btn.onmouseover = () => { btn.style.color = '#fff'; btn.style.borderColor = '#888'; };
            btn.onmouseout = () => { btn.style.color = '#888'; btn.style.borderColor = '#333'; };
        }
        return btn;
    };

    btnWrapper.appendChild(createLinkBtn('INITIATE WHATSAPP', 'https://wa.me/918818050651', true));
    btnWrapper.appendChild(createLinkBtn('ENCRYPTED EMAIL', 'mailto:digital.axd@gmail.com', false));

    const backBtn = this.createBackButton(overlay, app);
    backBtn.style.marginTop = '40px';

    overlay.appendChild(title);
    overlay.appendChild(btnWrapper);
    overlay.appendChild(backBtn);
    
    document.body.appendChild(overlay);

    void overlay.offsetWidth;
    overlay.style.opacity = '1';
    overlay.style.transform = 'translateX(0)';
  }
