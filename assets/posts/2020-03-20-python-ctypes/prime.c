#include <math.h>

__declspec(dllexport) _Bool is_prime(int n) {
    if (n <= 1) {
        return 0;
    } else if (n == 2) {
        return 1;
    } else if (n % 2 == 0) {
        return 0;
    }
    int sqrt_n = (int) sqrt(n);
    for (int i = 3; i <= sqrt_n; i += 1) {
        if (n % i == 0) {
            return 0;
        }
    }
    return 1;
}
