class BaseRepository:

    model = None

    @classmethod
    def get_all(cls):
        return cls.model.objects.all()

    @classmethod
    def get_by_id(cls, _id):
        return cls.model.objects.filter(id=_id).first()

    @classmethod
    def create(cls, data):
        return cls.model.objects.create(**data)

    @classmethod
    def update(cls, instance, data):
        for k, v in data.items():
            setattr(instance, k, v)
        instance.save()
        return instance

    @classmethod
    def delete(cls, instance):
        instance.delete()