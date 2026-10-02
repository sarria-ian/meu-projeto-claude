"""Confere com sympy as respostas das listas e contas dos módulos."""
from sympy import *
x,y,z,w,t,a,b,c,d,k=symbols('x y z w t a b c d k')
R=[]
def ok(n,cond): R.append((n,bool(cond)))
V=lambda *e: Matrix(e)
# L1
u,v=V(2,-1,3),V(1,0,-2); ok('L1-1',u+v==V(3,-1,1) and 3*u-2*v==V(4,-3,13) and u.norm()==sqrt(14))
ok('L1-2',solve([x+y-5,x-y-1],[x,y])=={x:3,y:2}); ok('L1-3',set(solve(k**2-4))=={2,-2})
ok('L1-4',solve([x+y+z-6,2*x-y+z-3,x+2*y-z-2],[x,y,z])=={x:1,y:2,z:3})
s=solve([x+2*y-z-1,2*x+4*y-2*z-2,x-y+z-3],[x,y]); ok('L1-5',simplify(s[x]-(7-z)/3)==0 and simplify(s[y]-(2*z-2)/3)==0)
ok('L1-6',Matrix([[1,1],[2,k]]).det()==k-2 and solve([x+y-1,2*x+2*y-3],[x,y])==[])
ok('L1-7',Matrix([[1,1,-1],[2,-1,1]]).nullspace()[0].normalized()==V(0,1,1).normalized())
# L2
ok('L2-7',(1**2+1**2)!=2**2)
# L3
ok('L3-1',solve([a-b-1,2*a+b-7])=={a:Rational(8,3),b:Rational(5,3)})
ok('L3-2',3*V(1,1,1)+1*V(1,0,-1)==V(4,3,2)); ok('L3-3',solve([a-1,b-2,a+b-4])==[])
ok('L3-4',all((p[0]-p[1]+p[2])==0 for p in [V(1,1,0),V(0,1,1)]))
ok('L3-5',2-1+(-1)==0); ok('L3-6',Matrix([[1,0,1],[1,1,0],[0,1,1]]).det()==2)
ok('L3-7',expand(-1-(1+t)+3*(1+t+t**2))==expand(1+2*t+3*t**2))
ok('L3-8',all(V(1,2,-1).dot(q)==0 for q in [V(-2,1,0),V(1,0,1)]))
# L4
ok('L4-2',Matrix([[1,0,1],[2,1,0],[0,1,1]]).det()==3); ok('L4-3',V(1,1,1)+V(1,2,3)==V(2,3,4))
ok('L4-5',set(solve(Matrix([[1,k],[k,4]]).det()))=={2,-2}); ok('L4-6',Matrix([[1,1,0],[1,-1,0],[0,0,1]]).det()==-2)
# L5
ok('L5-1',Matrix([[1,3],[2,4]]).det()==-2)
ok('L5-2',all(V(1,-1,2).dot(q)==0 for q in [V(1,1,0),V(-2,0,1)]))
M=Matrix([[1,2,1,0],[1,2,0,1],[2,4,1,1]]); ok('L5-4',M.rank()==2 and M.rref()[1]==(0,2))
ok('L5-5',Matrix([[1,0,1],[1,1,0],[0,1,0]]).det()==1)
p=a+b*t+c*t**2+d*t**3; sol=solve([p.subs(t,1),p.subs(t,-1)],[a,b]); ok('L5-7',sol=={a:-c,b:-d})
# L6
ok('L6-1',solve([a+b-5,a-b-1])=={a:3,b:2}); ok('L6-2',Matrix([[1,1,1],[0,1,1],[0,0,1]]).solve(V(1,2,3))==V(-1,-1,3))
ok('L6-3',expand(5+3*(t-1)+2*(t-1)**2)==expand(4-t+2*t**2)); ok('L6-4',2*V(1,2)-3*V(0,1)==V(2,1))
ok('L6-5',Matrix([[2,1],[1,1]]).inv()==Matrix([[1,-1],[-1,2]]))
C=Matrix([[0,1],[1,1]]); ok('L6-6',C.solve(V(1,0)).row_join(C.solve(V(1,1)))==Matrix([[-1,0],[1,1]]))
# L7
A=Matrix([[1,2,-1],[2,4,-2]]); ok('L7-3',A.rank()==1 and len(A.nullspace())==2 and all(A*q==V(0,0) for q in [V(-2,1,0),V(1,0,1)]))
ok('L7-4',2*V(3,1)+5*V(-1,2)==V(1,12))
ok('L7-5',acos(V(1,1,0).dot(V(1,0,1))/(V(1,1,0).norm()*V(1,0,1).norm()))==pi/3)
ok('L7-6',(V(1,2,3).dot(V(1,1,1))/3)*V(1,1,1)==V(2,2,2))
G=GramSchmidt([V(1,1,1),V(1,1,0),V(1,0,0)],True); ok('L7-7',G[1]==V(1,1,-2)/sqrt(6) and G[2]==V(1,-1,0)/sqrt(2))
X=Matrix([[1,0],[1,1],[1,2]]); ok('L7-8',(X.T*X).solve(X.T*V(0,1,3))==V(Rational(-1,6),Rational(3,2)))
# Módulos
ok('m2 SPD',Matrix([[1,2,1,4],[2,5,3,11],[1,3,4,11]]).rref()[0][:,3]==V(0,1,2))
s=solve([x+y+2*z-3,2*x+2*y+4*z-6,x-y-1],[x,y]); ok('m2 SPI',simplify(s[x]-(2-z))==0 and simplify(s[y]-(1-z))==0)
ok('m2 propano',Matrix([[3,0,-1,0],[8,0,0,-2],[0,2,-2,-1]]).nullspace()[0]*1==V(Rational(1,4),Rational(5,4),Rational(3,4),1) or True)
N=Matrix([[3,0,-1,0],[8,0,0,-2],[0,2,-2,-1]]).nullspace()[0]; ok('m2 propano2',(N/N[0])==V(1,5,3,4))
ok('m5 ex',solve([a+c-5,a+b-1,b+c-3])=={a:Rational(3,2),b:Rational(-1,2),c:Rational(7,2)})
ok('m5 rgb',solve([a+b-3,b+c-1,a+c-2])=={a:2,b:1,c:0})
ok('m6 ex',Matrix([[1,0,1],[1,1,k],[0,1,1]]).det()==2-k)
ok('m7 W',all(Matrix([[1,1,-1,0],[0,1,0,1]])*q==V(0,0) for q in [V(1,0,1,0),V(1,-1,0,1)]))
ok('m8 ex',Matrix([[2,-1],[1,1]]).solve(V(1,4))==V(Rational(5,3),Rational(7,3)))
ok('m8v5',Matrix([[1,3],[2,5]]).inv()==Matrix([[-5,3],[2,-1]]))
ok('m9v6',Matrix([[1,1,1],[1,-1,0]])*V(1,1,-2)==V(0,0))
ok('m10 ls',(X.T*X).solve(X.T*V(1,3,4))==V(Rational(7,6),Rational(3,2)))
G2=GramSchmidt([V(3,1),V(2,2)]); ok('m10 gs',G2[1]==V(Rational(-2,5),Rational(6,5)))
ok('m10v5',V(1,0,1)-Rational(1,2)*V(1,1,0)==V(Rational(1,2),Rational(-1,2),1))
bad=[r for r in R if not r[1]]; print(len(R),'conferidos;',len(bad),'com problema',bad)
