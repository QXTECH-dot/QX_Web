"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SearchBar } from "@/components/search/SearchBar";
import Link from "next/link";

export function HeroSection() {
  const textProp = 'mx-1 text-base hover:underline'
  return (
    <section className="bg-background py-10 md:pt-16 md:pb-8">
      <div className="container">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Find your cooperation with <span className="text-qxnet">54,685</span>
            <br />Companies across Australia<span className="text-qxnet-600 text-xs align-top">143</span>
          </h1>
          
          {/* SEO-friendly subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl">
            Australia's most comprehensive business directory. Search companies by name, ABN, or industry. 
            Access detailed business information, contact details, and company profiles instantly.
          </p>

          {/* Search form with new SearchBar component */}
          <br/>
          <br/>
          <div className="w-full max-w-2xl">
            <div className="scale-100 sm:scale-110 md:scale-125 lg:scale-150">
              <SearchBar
              placeholder="Search companies, ABN, business name or industry"
              fullWidth
              showLocationField
              />
            </div>
            <br/>
            <br/>
            <div className="text-md text-muted-foreground">
              Most popular searches this month: <span/>
              <Link href="/companies?industry=Finance" className = {textProp}>Finance</Link> •
              <Link href="/companies?industry=Construction" className = {textProp}>Construction</Link> •
              <Link href="/companies?industry=Accounting" className = {textProp}>Accounting</Link> •
              <Link href="/companies?industry=Education" className = {textProp}>Education</Link> •
              <Link href="/companies?industry=Healthcare" className = {textProp}>Healthcare</Link>
            </div>
          </div>
        </div>

        {/* Trusted by section */}
        <div className="mt-12 mb-4">
          <p className="text-center text-md font-semibold mb-4 uppercase">
            <span className="font-bold">Thousands</span> of Australian Businesses trust us
          </p>
          <br/>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="w-[120px] h-[50px] bg-white overflow-hidden flex items-center justify-center">
              <Image
                src="https://media.licdn.com/dms/image/v2/D4D0BAQEBHetFnaNJuQ/company-logo_200_200/company-logo_200_200/0/1727227196725/infinity_capital_mortgage_management_logo?e=2147483647&v=beta&t=mRyLnMYzpyJViIwwgxNjRYxtzI1IWO7PXwJ6KySWa-w"
                alt="Infinity Capital"
                width={150}
                height={50}
                className="object-cover"
              />
            </div>
            <div className="w-[120px] h-[50px] bg-white overflow-hidden flex items-center justify-center">
              <Image
                src="https://vateefx.com/wp-content/uploads/2022/07/%E5%8E%9F%E6%9C%89%E8%B5%84%E6%BA%90-8.png"
                alt="Vateefx"
                width={100}
                height={40}
                className="object-cover"
              />
            </div>
            <div className="w-[120px] h-[50px] bg-white overflow-hidden flex items-center justify-center">
              <Image
                src="https://livecomfy.com.au/wp-content/uploads/2020/01/Live_Comfy_Landscape_Logo.png"
                alt="LiveComfy"
                width={100}
                height={40}
                className="object-cover"
              />
            </div>
            <div className="w-[120px] h-[50px] bg-white overflow-hidden flex items-center justify-center">
              <Image
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQsokQ6Q52JP5TdXBQhJEOntYoQNYXeksMYQ&s"
                alt="VIP Mortgage"
                width={80}
                height={40}
                className="object-cover"
              />
            </div>
            <div className="w-[120px] h-[50px] bg-white overflow-hidden flex items-center justify-center">
              <Image
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZwAAAB6CAMAAAC89RUgAAAAw1BMVEX////3uT84PUn3tzkpLz33tzYuM0H5y3b60401Okb++fA3PUn3uz8mLDuQkpjW19m4ubyxsrZARE/73ahPU17r6+x+gIfd3uBcYGoYIDH3tS75+fnKy85zdn3w8PExNkMdJTX96sqoqq5obHSWmJ0THC/P0NJITFe+v8L++e/4wFWipKmJi5H98Nloa3RYXGX61ZX847j5zoIAESf4xGP4v1L98d386MP74LL5zof72qD5zXz5yG/2syAKFioAABQAAB5WdkeAAAAUUklEQVR4nO1deX+bPBK2zZEQBx+Ew+aOL5yY2Gmutmnq3e//qRYJc1hCB5judn8vzx9tEuNB6JFGo9HM0Ot16NChQ4cOHTp06NChQ4cOHTp06NChDdw83NREpZiHB+JHHRrjSritg/7749vVz8/7B0TMt3fp9v3t6+rn8+e3+4eOpXZwJfXrQRAESbLtt+enMzk3z5IEP0o+s2/fXu6eOoYuxpVQk5yMI8l+f/4oS3p6k0qfSrb09vy9I+giNCUn5efX2fR5ttHP7a+7D9KdOzBxATkJJPulvPp8F1Bpgm0//ujmT0NcRk5Cj3RXkvZ0i4tL+LlG7YcOXLiUnH7ffi9prqd+lTzp98vfS4+xmaxMb7n3zHi12I6d/3V7SricnGRq3BfynqqtP+n3Nadyc8YcsAy/jU503NVMDVVRDoJACQJZFtVwrng7K/3YWkyn04XVwo0aogVy+v3f3wqB93b1NZL9jdyKEsZrlQ+hqs3MxdZo+uTOdq+qcjDIMDz9rwSiqu0SsVsRYD1pKN73nUsHUCvk9H//KCT+ILDTt694Js9YHA44oST9KIoDc+LXf+6xKYtBmZOMIfi7IqreSFTAj+IU//JSlTkR6N5q23jutUNO/3dJsxH3tVL/idyQvNdEXm6KkR6YNZ/f8sSgLKNiPARy+tcqcrwAv57YOlmUNW/SaIK3RE5fKlb8B6LTQbDvKE1JwSZniHelLI9qqBDLg9qsJEYB6w1YenCixAUuYD9PrlXy5gzz7wRQE8q5shxm4kVl1kA9tkWO8FbI/CQptkS1fbIatDkmC4GiVI9mCAX/IKHnsOF95JWMDPxA1ZbxbrdbxTNVRO8s7nAJ/may8wahjLXPW+yAnNE+UANETqBG3C3M0BY5/dKkuLnluqwazniyi5eaij15MgD3XoJ9pIooP0OghrZcD+zvkakZqMtJPu2Mha4qZ70qr4gNjdE2ivnscFxTRj9VqjQkFa2R0+8Xiu2OPHX6EpfR5rsxrtdFuLI4jrU7YPQkzz4ccwjeaEificiUc6bK2Z2J5CTYobLKvW+YaCMVlW/85GiPHOk5F3pDcXULtxxWAcAUW3zEfNl3thHOXRCx1x0X7TAxxq6xzmTLI7I0Rz+XhkyNLaqBlUE9u7KxVxoeD4BTgoKdYuq8UKSWVycqMMUmlmwyI8LnTtXycA5XRrmpmhe+XmJHxtkrgJhtqN6aYHqPwnQF6pOTsGJL729Xv16ur69fvh5vbVuCQkpT5ztFr/XtH5T2lKCj3V8mp8qqUwYMiRuUG9msvM4YFNcF1ZekGJ33PraomAg7ilJr6tQkJ5ku778+7z+KSXLz8PHj5VGwhb7wmG8yb37TZPT5HG26cmbuDM/J6WHLcdI5LlWgoaFqRicowk0h+yJyLLSF9VadWuRI0ttz5Qnnzcfd1639u1hN3mliS1OMBgY5VoiTQ9VrzuFcCQ1L1hWKRT4vA48ikkUOtl2lmRc4apAj9a9pa/nH3XvR6df002+uqcMgB1d79FHeG6GKUDmQLYhl1qvBkiaSRc4CtdupLUTBTY7U/2R2aXF28I226LA3OxD0NSfpP5wcWkducOuPomPyZUfZU2QyydmoSAtp8xADJzmC9FzrRIZqESSrE48MFjkzzJqmjUtUqdEnTjHmgxnlIiY5iNky/BPk2F81QwFIBwcZOzziGGoN3WQM6GvOVEWvput/52SrKwfKRRzknHuh2ldrAq/xW4BBDpdAFjky5n6j6KkKKmW6K/u0Cb6UHOSetTY6HOQIt/UjaOhqrS9ccchgkLPFpoISkPVUMnEQKqn6qpfTqeiUa2qvOWot3zSbHOmxQfTMHStWkUMGY80xsSWHsKWEwBco5iDewVGvRJRLmOSgPii53U2o/VVHHK9YgYNwOjlbfJujkvWUhetA5n7QAu7poaJRLuHY55zdluoLwsHqxWbc9OhaLZmOHJqSqtZc3HujVhyLZdjhl4vM01O417mIHB/xAIr1DkQZ5EjNuGHYA4lcDtc0beYsUC9Zwg1tVO6xy5WIqWEmc1mWRYVyBYucyfmYCGse6NDJ4fYg15IKyLlnC0HIKc2czQybCIpKc91gXrVEXVF3ORD+DoJyBYMc53ziUIdPFajdyOuiRMGcOE3IOSkFfzyd4dNGDqiDssKFHdB2/rxgkHPumw1r7XEAqOTwdGEVHtkmYBO1pkQJtEDEtvqyatKVOW5213SkEEAnZ1XegQb1rGgIGjnSdbMm/2Ln/PAZBGiHKgDYH8VBzFrbV/jxQr29OgE0cnyvNF2D0GsQvUYhR3hvptSumUotkc0hGienCoo+ZZ9O43uiP02OPymCFZKZva8deQNAIae+0wbimYObZpvQakSzFXNQVkQB/hFyFj3HcXzf2Jqamnm1ZTUaNYz5JJMjNPEM9B648hgFHgudk5xErwWzBX3N2WPk1PQPE4CQo0SHBHo0UPPQDkVfjRtEC6cgk8MZeH6Gm7t3rhxTTscnRkNACCsMRI06Og84z9SzH16MsBgBdFlU9MaR9hRyhPe6E+fm4/OdS6XxGWsV1to+TmB6s6GKzQRFDignALhnjXGawwmUnEAUFcRPFBwaTxwyOUxT7ebh6b7At7ufb5LEeawqvPM0Dd/nZMaosV0qmP2liDPi5FlWkKM377QcCDlBvJ3MAsSJJy8bjwIiOTZ9cH/79W6fgZuZPm+EB5mcBJYZ4AehCinmEzcIhkp0gb7JUGGtWVi4o9jY9CCRQ9dq94/2JZGiPLscBjnJrl8PUE+zMiR0OKp+IP4MOb3xAGt3vVDCAiRypJ+UL31eRA2frcYk5yz074SAcDI2wdw3Q9oBAzcq9zlYyG9lGgkPiORQAmQoKR5c4DIH2ORUHekQBikeeVOdFVUX1ZtQ3FlEi/OhgESOTXar3dPCOXm4+cXXNOQ8Byenap2fVyorC59krexCCR4CLJhEUVv1ENhk/wol+4YPnCEJbHJc3J9JCMCp2ugwYgh4QHLf7DB22Ed7FSCRc0u0B+jxgmxwe4XY5PRwcgjxGBUWgaJdbhEQfWsxxk696IEUBHIovpsLM3psvkDpHhc5EXpJotcqdxVoFAwAl6qhE0h2fC7R0RBo9bc79cm5TKvxc8M2CCq1VVipP5wqvcax6LivHo0eypEBFmBKsiQpqE0ONbuDBZ506hwc5OChAaT5gEaUD7j0mq8pgRqTFRKFHEdD2ZFrn72SlBRxD3oJOdJtnaNVDnJ2eEUJtTpHB48iSC5lGtMe6HyZvImkHbYZmH+2tqugvkHQWK1J9nMtXyoHOSsZIyckuHCwBBBK7lSGk9EVECNyqcfUYxV9ALVWdg5lE0rsx1+NDALBtl9qRvVyGAR71MuYGAQEJVThT6jOCC2Q+RWqlzEAegwB7pdgz9UzEPc5xJ5ssAcFNSXvap95s8lxMBtsSM4LxfYe4HyItvtwoV4a0ihkRN/gs5WRGImASM534lc44jcQNKvGyianYpUnm2AOfhxK3YhuT4dmtGBpVlDh/vzz4UBR6rBDVGvkOig3fKedJTSrI8kkx8dDcUj2AIBVcTk59n2arecUiUxycDOkFjvEIwNKksbNWz0ngfD22aQMK8sgcKqO0GiRzdsq96dXaRQ4efkNqr8fJQdbFF38TLAGO8T9/i1tjfhZ52gNJsi/1S/Diu0b5TO/WdJ/eF+HVPfvosJPIFfUC3KmetapdA8ckm5f4Xxe4YHDA24nKPkklLzoJPh4fixOQHl4Eux3dsLvOTC1NghKg85CCwzBnmaE1CyqauaInlWePY6x03MjOIioDktk7lZF9CzRZSdhh6dIDwA5huCF/sWbj+/fAO5eXt7eeSaSYPfrBMI5FcNckWPX952e429iBddpA5npaJ5WsDMI5EPsGobv+4Y1jWdycQ2DG3RJGVYUNkDrwEB2OI93KG5M/oH+8PH5JnBYCTx5v45hGGN3Gh8qi+LJ6kCfLWcRXvEreWiRI5RiE1XJVWRVDTQ9CkKxXIyNwY2FBfUoAR6hhS47QzhZXR43KCVurYYbLMHHdZ9NjyBQlSXAOFRDVRXl6nJ4YCcTVARMg57kS4Z1TGzjnvUsKpYYzuP41ma789CiegCyuFxNjbOex5cdWBov3i1YpkGLEZ8Pzxz0ME9zGGUkh2f/FR0rKh6vJp9oWDnCSq5EYmlKbw7GD6HQpyKL4Zm/p2qDlRb/nDNaSouVrjd1Ejz85MgvYPg++QqwlrsWVGDVdzVOGv2dVrX0INTo5HHtyQoVyOmAoclBFWSV0VBqlkH9zeN3pmXAyl2oVR1XSYZpoHm1C3M7C+008KsnkCJqNC+YN9DoQDylG8+sBqOZbefn3DPnDjXoChT9FjkhB0q0jxtWbXa2iVWWZsjhKlLUF39F1fzWM9sY5SEAqCabMWFjm8DdWBfG0/ruKFIhxwqchGAVSKBqdVTkHwU9J7SBYut9MZN1+U+q/zic8WRlHrRADQfRzIsX243RQgh1W6CHazTJdGdm6/LVjOrAjKWxGyw71CqFAA1q6fwzwazgUZ+dF5ZNQIkm7VAGu/ZNbXaYUYdNcub+kWCHCNqcoc05Hljn2A0zgf954IjflB7r+fpvmIVvarse/qHgqlTYZ7ory+jIaQtckc+CzfvGNYCOnLbAGZZuP/Iv4h05bYE3Z0Cw35gvM75J16aOnLbAn9Ah2I/UIJqHu366f7mMHHASmgBzovgGeh2Pb9I3CuAy2DfPfzTGY7/nj8ctZPnyo062jSAJX9+qLbeH71e39im++jJy3PS9aRF6drYcnJOxoMWT5YAViTRtkNYdiFkZ1NtAgzdfng75jSyubRIc/zU19PW/26j7wY26bwGx+1/P3x/KCu7m4fvzF3gLSHYWcCE5oW6apjcTkVwOD3l10WLNQ84OnKQMAvBv7PRMmUVOeIA3D+YmvJsxOJEjK4utb6qxy3vc2goavD9Hsu33t5fr5+fP5+ufV2+P2ftzsrISF5IzT0OTJ+H5caKPKLrFnDs4T1dPvJoBi5zTza3D6YfTXf0QBD3NtP+yx7phEmH63qmzV0/l9UAvJecUpxHBE3a/56TnNuXX1frJnwpyHMty8o8NC+9/XT11KiDHKB8D+db5ypWR0zOGaSHbVKxjhWby00EvrvatLNgt+cDPfy6kgwguqxQQV/oIuy0J7b2zLXdntkSOJsPftofjHOiSYs3xzflxHe/CEznTweurtl3Ck+HN4XX9OkNVT0GOsp29voZZHVTDW69fo3IMWU5ObzQHhR2MNN/JUxVFVMXkn9Oi5Zjh+lVJSz+MIlc+irBx7uG4Pu7T1/4dF1M5aVgWyDaJXtdrD7bDAF+mHoNnaI2coixHK+Q4qzUIvt2qemTOwDMtlWx0HsLRZqsHp2yKxfrgbmIRvnJgs9a244mG1uYozRzRc91MZRkDeTF2Z6+lQMCCHBdSaKgwhnMzEZfu1tWjySncTJ+PNhvvCC+OFW1mLtNv6+D2MK/EWevizt0pp7Ysjro73oWgUpUfqauxuzwyXzDX5ntCczP7QnJUTdf1SEyzwFw1K/+ckzNZg08MLbXWHBkaCjsVBHtGMJ/cQEupFeTA4sGOqJ9+c9OOLlRMQc5Y9CA5qUHgQ6pmWSbcAg6cnjkHPT9ST0G4jgbXJEsEt3fmMMVuOodX+irMI1n9ewvmJBwN+zXbKm+LnFIclXMpOaAIbiDCmFU3zCIFc3KWKnyqVarWtlD99PzBAcSGpBd74flzl8iBGi8aAlGGlibQTteFYiOTA/6fZQNFD9NrQnD1KNOvbkpEanYkMwf8bKXtn6yhFvPdZK+kp6E52zVbsbVEjlTKGKG9JZSDnFP/bAbHMfgtq+mTkxOlNvU2NaVPFrUzO4CqJgfwCl5Pn59b4WcGAfgdirLUCF49C4uyQQU5G0gLgRx1AL+5hASO1NMat1Bn6e3BJsBZw+lrpYW+8wUy+ctQS78cskuAt0POeVgAK6WXzyCYgA5x8/FVkJMqFzdlZXfa7gByFqo+gzhwkRNG6dWzYggX5EzhTwRy5trpm6Cpo6xyyk48nP48BuRAZXciZxXmLbKC7Mvs7N1WyBHOc69ZNb/5yBmH+0py9PQ1tZOUlckaanCoLE4/YyCRg8f0FeQc4OwjkCOWU7Rycsr6ESFnl9r9YFdgKPyVX9sgR0IiqFhBBHzk7IC6riAnXsNRGKeawgpTewoYBNY6TQGJvfPNYjU5/kk/Tks1n3NyptDAIJGzTGtTbfagcTk5m9PFsWmg5GyO8KHG4L9Dao5v9+xNdAvk2OjbKFhBBAxyYuCttBbi2qokxxJBSVNXPJnSHrCcxhFMzVnC5WMSIrVVq8lJNCLoTEs+FlRuwxjcexyr6UJCIMc9zoBNrB8BrTk5vUMIZu5kDppyTk7SBCBvDx5pugaZjoZ2ZIcuXkyOgFezYdnSdHLWadzlHCYibV8zcvZi1uPT+dDcq/vTYuPM1sFg7kWgR/xorcezcIA8drTOrTVITpSKcryjZnpq2Q00mcObh+tTLqIxT3WQcQTkHHL3zepV8UwlNajjvCyFEc0P5mwOq7Y4qYt0PE/JsYJwaWpHaHrE64HpyRzG2sXk2I8VZQcZeo1KjjVaQUxgR1hxpnMWq3w6bMyD51r5Cwy2q5XrQ3J6zsI7LHeoB2yV5XJMR/CjXWaeb81kTT974TW4+Wi1y27qj9Iu9GMwUnalJsSz2alp21FuuJdvH0MijNFpGfRX+4N5Eusmt415PKgXkSPY/cp+vqGnibZ52GZsYdcYYhsF1v82NCdHkOzHO8Lh6BO1Qmub5PhQ/Seqov4LUP5+NCMnIUZ6fLknn1s/0ZLcWj2mHiXLzGg2b+O1EX8drmypLmz8wA3Hw0+BKLl+yhwNE0/Xly1Uuv0LcXddF58/nriCDD+Ion+2HCvtOOxrOnTo0KFDhw4dOnTo0KFDhw4d/k/wHwLY7Lg9Tb/QAAAAAElFTkSuQmCC"
                alt="Bridge The Difference"
                width={120}
                height={40}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
