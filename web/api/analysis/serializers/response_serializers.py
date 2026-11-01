from rest_framework import serializers


class AnalysisResultItemSerializer(serializers.Serializer):
    """Serializer para um item de resultado de análise."""
    common_name = serializers.CharField()
    scientific_name = serializers.CharField()
    susceptible_animal_species = serializers.ListField(child=serializers.CharField())
    human_risks = serializers.CharField()
    common_symptoms = serializers.ListField(child=serializers.CharField())
    recommended_actions = serializers.ListField(child=serializers.CharField())
    confidence_score = serializers.FloatField()


class AnalysisCreateResponseSerializer(serializers.Serializer):
    """Serializer para resposta de criação de análise."""
    search_request_id = serializers.IntegerField()
    result_type = serializers.CharField()
    analysis_results = AnalysisResultItemSerializer(many=True)
    error_message = serializers.CharField(required=False, allow_null=True)


class AnalysisHistoryResultItemSerializer(serializers.Serializer):
    """Serializer para o resultado de análise no histórico."""
    common_name = serializers.CharField()
    Description = serializers.CharField()


class AnalysisHistoryItemSerializer(serializers.Serializer):
    """Serializer para um item do histórico de análises."""
    search_request_id = serializers.IntegerField()
    status = serializers.CharField()
    result_type = serializers.CharField()
    request_date = serializers.DateTimeField()
    finished_at = serializers.DateTimeField(required=False, allow_null=True)
    image = serializers.URLField(required=False, allow_null=True)
    analysis_result = AnalysisHistoryResultItemSerializer(required=False, allow_null=True)


class AnalysisHistoryResponseSerializer(serializers.Serializer):
    """Serializer para resposta de histórico de análises."""
    pass  # É uma lista, não um objeto wrapper


class AnalysisDetailResponseSerializer(serializers.Serializer):
    """Serializer para resposta de detalhes de análise."""
    search_request_id = serializers.IntegerField()
    result_type = serializers.CharField()
    status = serializers.CharField()
    request_date = serializers.DateTimeField()
    finished_at = serializers.DateTimeField(required=False, allow_null=True)
    analysis_results = AnalysisResultItemSerializer(many=True)
    error_message = serializers.CharField(required=False, allow_null=True)


class AnalysisResultErrorSerializer(serializers.Serializer):
    """Serializer para o resultado com erro."""
    status = serializers.CharField()
    error = serializers.CharField(required=False, allow_null=True)


class AnalysisResultSuccessSerializer(serializers.Serializer):
    """Serializer para o resultado com sucesso."""
    status = serializers.CharField()
    plant_name = serializers.CharField(required=False, allow_null=True)


class AnalysisResultPendingSerializer(serializers.Serializer):
    """Serializer para o resultado pendente."""
    status = serializers.CharField()
    message = serializers.CharField(required=False, allow_null=True)


class AllAnalysisResultSerializer(serializers.Serializer):
    """Serializer para o resultado (pode ser sucesso, erro ou pendente)."""
    status = serializers.CharField()
    error = serializers.CharField(required=False, allow_null=True)
    plant_name = serializers.CharField(required=False, allow_null=True)
    message = serializers.CharField(required=False, allow_null=True)


class AllAnalysisItemSerializer(serializers.Serializer):
    """Serializer para um item da listagem completa de análises."""
    search_request_id = serializers.IntegerField()
    request_date = serializers.DateTimeField()
    status = serializers.CharField()
    result = AllAnalysisResultSerializer()


class AllAnalysisResponseSerializer(serializers.Serializer):
    """Serializer para resposta de listagem completa de análises."""
    pass  # É uma lista, não um objeto wrapper

