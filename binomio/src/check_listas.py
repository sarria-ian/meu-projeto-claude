"""Confere com sympy as respostas das listas e números usados nos módulos."""
from sympy import *
x,y,a,b,c,n=symbols('x y a b c n')
B=binomial; F=factorial
def co(expr,var,p): return Poly(expand(expr*var**40),var).coeff_monomial(var**(p+40))
chk=[]
def ok(name,got,exp):
    try: r = simplify(got-exp)==0
    except TypeError: r = got==exp
    chk.append((name,r,got,exp))
# Lista 1
ok('L1-1a',F(6),720);ok('L1-1b',F(8)/F(6),56);ok('L1-1c',F(12)/(F(10)*F(2)),66);ok('L1-1d',(F(5)+F(4))/F(3),24)
ok('L1-2c',simplify((F(n+2)-F(n+1))/F(n)).rewrite(gamma).simplify() if False else combsimp((factorial(n+2)-factorial(n+1))/factorial(n)),(n+1)**2)
ok('L1-3a',[s for s in solve((n+2)*(n+1)-20) if s>0][0],3);ok('L1-3b',[s for s in solve(n*(n-1)-42) if s>0][0],7);ok('L1-3c',[s for s in solve(n*(n+1)-6) if s>0][0],2)
ok('L1-5a',26**3*10**4,175760000);ok('L1-5b',26*25*24*10*9*8*7,78624000)
import itertools
ok('L1-6',sum(1 for p in itertools.permutations(range(5)) if abs(p.index(0)-p.index(1))!=1),72)
# Lista 2
ok('L2-1a',B(7,3),35);ok('L2-1b',B(10,8),45);ok('L2-4',B(12,4),495);ok('L2-4b',B(11,3),165);ok('L2-5',B(6,3)+B(6,4),35)
ok('L2-6',B(11,4)-B(6,4),315);ok('L2-7',B(15,9)+B(15,10),8008);ok('L2-9',sum(B(i,3) for i in range(3,10)),210)
ok('L2-3',[xx for xx in range(0,15) if 0<=3*xx-2<=14 and B(14,xx)==B(14,3*xx-2)]==[1,4],True)
# Lista 3
ok('L3-1',expand((x+1)**5),x**5+5*x**4+10*x**3+10*x**2+5*x+1)
ok('L3-2',expand((2*x-1)**4),16*x**4-32*x**3+24*x**2-8*x+1)
ok('L3-3',expand((x+3)**4),x**4+12*x**3+54*x**2+108*x+81)
ok('L3-4',expand((a-2*b)**3),a**3-6*a**2*b+12*a*b**2-8*b**3)
ok('L3-5',expand((x+1/x)**3),x**3+3*x+3/x+x**-3)
ok('L3-6',expand((x**2-2)**3),x**6-6*x**4+12*x**2-8)
ok('L3-7',expand((1+sqrt(2))**4),17+12*sqrt(2));ok('L3-8',expand((sqrt(3)+1)**3+(sqrt(3)-1)**3),12*sqrt(3))
# Lista 4
ok('L4-1',co((x+2)**7,x,3),560);ok('L4-2',co((2*x-1)**6,x,4),240);ok('L4-3',co((x-2)**8,x,5),-448)
ok('L4-4',co((x+2/x)**6,x,0),160);ok('L4-5',co((x**2-1/x)**6,x,0),15);ok('L4-6',co((3*x**2+1/x)**5,x,4),270)
ok('L4-7',co((x+1/x)**8,x,3),0);ok('L4-8',co((x-1/x)**10,x,0),-252)
ok('L4-9',co((a+2)**5,a,3),40);ok('L4-9b',co((a+2)**5,a,2),80)
ok('L4-10',co((x+3)**6,x,4),135);ok('L4-11',B(8,2),28)
# Lista 5
ok('L5-3',3**6,729);ok('L5-5',sum(B(11,k) for k in range(1,12,2)),1024);ok('L5-6',4**4-3**4,175)
cs=[B(8,k)*3**k for k in range(9)];ok('L5-8',(max(cs),cs.index(max(cs))),(20412,6))
# Lista 6
ok('L6-1',1+6*Rational(3,100)+15*Rational(3,100)**2,Rational(11935,10000))
ok('L6-2',pow(13,25,12),1);ok('L6-3',pow(3,50,4),1);ok('L6-4',pow(6,25,7),6)
ok('L6-6',B(8,3)/Integer(256),Rational(7,32));ok('L6-7',B(4,2)*Rational(1,36)*Rational(25,36),Rational(25,216))
ok('L6-8',co((1+x)**4*(1-x)**2,x,3),-4)
ok('L6-9',Poly(expand((a+b+c)**4),a,b,c).coeff_monomial(a**2*b*c),12);ok('L6-10',sum(k*B(7,k) for k in range(8)),448)
# Lista 7
ok('L7-1',co((2*x+x**-2)**6,x,0),240);ok('L7-2',B(8,4),70);ok('L7-3',99**3,970299);ok('L7-5',co((1+x+x**2)**3,x,2),6)
ok('L7-6',Rational(11,10)**5,Rational(161051,100000));ok('L7-8',B(5,4)*Rational(4,5)**4*Rational(1,5)+Rational(4,5)**5,Rational(73728,100000))
# Módulos
ok('m1 1001^2',1001**2,1002001);ok('m3 mega',B(60,6),50063860);ok('m3 prod',60*59*58*57*56*55,36045979200)
ok('m5 (2x+3)^3',expand((2*x+3)**3),8*x**3+36*x**2+54*x+27);ok('m5 (x+1/x)^4 indep',co((x+1/x)**4,x,0),6)
ok('m6 4o termo',co((x-3)**8,x,5),-1512);ok('m6 x7',co((x+2)**10,x,7),960);ok('m6 indep',co((x**2+1/x)**9,x,0),84)
ok('m6 medio',co((2*x-1)**6,x,3),-160);ok('m6v6',co((x**3-2/x**2)**10,x,0),13440);ok('m6 ex2',co((2*x-1/x)**6,x,0),-160)
ok('m7 max',max(B(10,k)*2**k for k in range(11)),15360);ok('m7 ex',(1-3+1)**5,-1);ok('m7 pares',sum(B(8,k) for k in range(0,9,2)),128)
ok('m8 aprox',abs(float(Rational(102,100)**10)-1.218994)<1e-6,True)
ok('m8 chute',abs(float(sum(B(10,k)*Rational(1,5)**k*Rational(4,5)**(10-k) for k in range(6,11)))-0.0064)<5e-5,True)
ok('m9 prod',co((1+x)**5*(1-x)**3,x,2),-2);ok('m9 prod2',co((2+x)*(1+x)**6,x,3),55)
ok('m9 tri',Poly(expand((x+y+2)**5),x,y).coeff_monomial(x**2*y),120);ok('m9v3',co((1+x)**4*(1+2*x)**3,x,1),10)
ok('m9 serie',series((1+x)**-2,x,0,4).removeO(),1-2*x+3*x**2-4*x**3)
bad=[c for c in chk if not c[1]]
print(len(chk),'conferidos;',len(bad),'com problema')
for c in bad: print('  ERRO',c)
