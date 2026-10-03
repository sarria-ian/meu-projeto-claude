"""As respostas das listas são conferidas por asserts dentro de listas.py e gen.py (sympy, frações exatas).
Rodar este arquivo executa todas essas conferências."""
import listas
print("ok:", sum(len(x) for x in (listas.L1, listas.L2, listas.L3, listas.L4, listas.L5)), "itens gerados e conferidos")
