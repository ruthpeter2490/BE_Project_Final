from unet import UNet
# import torch.nn as nn
# import torchvision
# import os

import torch
import torch.utils.data as data
import torchvision.utils as utils
import torchvision.datasets as dataset
import torchvision.transforms as transforms
import pathlib

img_size = 256
batch_size = 5


def process_batch_with_unet(image_path, result_path):
    path = pathlib.Path(image_path)

    # full_path = path.absolute()
    img_dir = path.as_posix()
    print(img_dir)
    print(type(img_dir))
    img_data = dataset.ImageFolder(root=img_dir, transform=transforms.Compose([
                                                transforms.Resize(size=img_size),
                                                transforms.CenterCrop(size=(img_size, img_size)),
                                                transforms.ToTensor()
                                                ]))
    print(img_data)
    img_batch = data.DataLoader(img_data, batch_size=batch_size,
                                shuffle=True)

    # device = torch.device('cpu')
    # model = UNet(3, 3, 64).cpu()
    # model.load_state_dict(torch.load(pathlib.Path('../model/unet.pkl'), map_location=device))
    # model = torch.load()
    model = torch.load(pathlib.Path('../model/unet.pkl'), map_location='cpu').cpu().float()

    for _, (image, label) in enumerate(img_batch):
        print(type(image))
        x = torch.tensor(image).cpu()
        y = model.forward(x)
        utils.save_image(y.cpu().data, pathlib.Path(result_path))


if __name__ == "__main__":
    process_batch_with_unet('test1/')
