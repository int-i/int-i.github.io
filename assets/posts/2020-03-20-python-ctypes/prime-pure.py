import math
import timeit

def is_prime(n):
    if n <= 1:
        return False
    elif n == 2:
        return True
    elif n % 2 == 0:
        return False
    sqrt_n = int(math.sqrt(n))
    for i in range(3, sqrt_n + 1):
        if n % i == 0:
            return False
    return True

def test():
    is_prime(2147483647)

if __name__ == '__main__':  
    t = timeit.timeit(test, number=1000)
    print(t)
