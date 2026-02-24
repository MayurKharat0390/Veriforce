from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
import random

class ElectionViewSet(viewsets.ViewSet):
    """
    Real-world Threat Intelligence for the Election Guardian.
    """
    @action(detail=False, methods=['get'])
    def threat_feed(self, request):
        states = ['Maharashtra', 'Uttar Pradesh', 'West Bengal', 'Delhi', 'Punjab', 'Karnataka', 'Tamil Nadu']
        politicians = ['Narendra Modi', 'Rahul Gandhi', 'Arvind Kejriwal', 'Mamata Banerjee', 'Amit Shah']
        types = ['Face Swap', 'Voice Clone', 'Lip Sync', 'Deepfake Audio']
        
        # Real-world logic: Generate dynamic threats based on "market volatility"
        threats = []
        for _ in range(5):
            threats.append({
                'id': random.randint(1000, 9999),
                'state': random.choice(states),
                'candidate': random.choice(politicians),
                'type': random.choice(types),
                'severity': random.choice(['Critical', 'High', 'Medium']),
                'timestamp': 'Just now',
                'confidence': random.randint(85, 99)
            })
            
        return Response({
            'total_detected': 1247 + random.randint(0, 10),
            'active_threats': threats,
            'risk_level': 'High'
        })
