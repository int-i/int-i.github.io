import ctypes
import timeit

libc = ctypes.CDLL('./prime.dll')
libc.is_prime.argtypes = [ctypes.c_int]
libc.is_prime.restype = ctypes.c_bool

def test():
    libc.is_prime(2147483647)

if __name__ == '__main__':  
    t = timeit.timeit(test, number=1000)
    print(t)
