# Imports the Google Cloud client library
from google.cloud import storage

class StorageManager:
    def __init__(self) -> None:
        self.storage_client = storage.Client()
        # The name for the new bucket
        self.bucket_name = "aixlaw"


    def upload_to_bucket(self, path_to_file, destination_blob_name, destination_path=""):
        """ Upload data to a bucket"""

        bucket = self.storage_client.get_bucket(self.bucket_name)
        blob = bucket.blob(destination_path+destination_blob_name)
        blob.upload_from_filename(path_to_file)

        uri = blob.path_helper(self.bucket_name, destination_blob_name)
        print(f"> Uploaded {destination_blob_name} to {self.bucket_name} with\n | url: {blob.public_url}\n | uri: gs://{uri}")
            
        return blob.public_url
    
if __name__ == "__main__":
    print("Testing upload of file to GCloud")
    url = "sample_data/test.pdf"

    manager = StorageManager()
    manager.upload_to_bucket(url, "test.pdf")