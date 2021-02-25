import math
from sklearn.metrics.pairwise import euclidean_distances
class model:
    def __init__(self):
        self.model = svm.SVC(kernel = log_kernel)
    def train(self,x,y):
        return self.model.fit(x, y)
    def predict(self,x):
        return self.model.predict(x)
    def log_kernel(x,y):
        kernel = euclidean_distances(x,y)
        kernel = -np.log(kernel+1)
        return kernel
    def save(self,fileName):
        joblib.dump(self,fileName)