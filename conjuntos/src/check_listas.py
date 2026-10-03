"""As respostas das listas são conferidas por asserts com conjuntos do Python dentro de listas.py."""
import listas
print("ok:", sum(len(x) for x in (listas.L1, listas.L2, listas.L3, listas.L4, listas.L5)), "itens")
